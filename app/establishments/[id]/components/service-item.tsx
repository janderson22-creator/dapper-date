"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Booking, Establishment, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../actions/get-day-bookings";

interface ServiceItemProps {
  establishment: Establishment;
  service: Service;
  isAuthenticated?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  establishment,
  service,
  isAuthenticated,
}) => {
  const router = useRouter();
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking>([]);

  useEffect(() => {
    if (!date) return;

    const refreshAvailableHours = async () => {
      const bookingsDay = await getDayBookings(date, establishment.id);

      setDayBookings(bookingsDay);
    };

    refreshAvailableHours();
  }, [date, establishment.id]);

  const dateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const bookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const bookingSubmit = useCallback(async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }
      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        establishmentId: establishment.id,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'ás' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  }, [data?.user, date, establishment.id, hour, router, service.id]);

  const timeList = useMemo(() => {
    if (!date) return [];

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const bookingList = dayBookings.find((booking: Booking) => {
        const bookingHour = booking?.date.getHours();
        const bookingMinutes = booking?.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!bookingList) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-3">
        <Image
          src={service.imageUrl}
          alt={""}
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover rounded-lg min-w-[110px] min-h-[110px] max-w-[110px] max-h-[110px]"
        />

        <div className="flex flex-col w-full">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm text-gray-400">{service.description}</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-primary font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger asChild>
                <Button onClick={bookingClick} variant="secondary">
                  Reservar
                </Button>
              </SheetTrigger>

              <SheetContent className="p-0 w-10/12">
                <SheetHeader className="text-left px-5 py-2.5 border-b border-secondary">
                  <SheetTitle>Fazer Reserva</SheetTitle>
                </SheetHeader>

                {/* React Day Picker Below */}

                <div className="py-6">
                  <Calendar
                    className="w-full"
                    mode="single"
                    selected={date}
                    onSelect={dateClick}
                    locale={ptBR}
                    fromDate={new Date()}
                    styles={{
                      head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                      },
                      cell: {
                        width: "100%",
                      },
                      button: {
                        width: "100%",
                      },
                      nav_button_previous: {
                        width: "32px",
                        height: "32px",
                      },
                      nav_button_next: {
                        width: "32px",
                        height: "32px",
                      },
                      caption: {
                        textTransform: "capitalize",
                      },
                    }}
                  />
                </div>

                {date && (
                  <div className="flex gap-3 py-6 px-5 border-t border-secondary overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {timeList.map((time, index) => (
                      <Button
                        onClick={() => setHour(time)}
                        variant={hour === time ? "default" : "outline"}
                        className="rounded-full"
                        key={index}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="py-6 px-5 border-t border-secondary">
                  <Card>
                    <CardContent className="p-3 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold">{service.name}</h2>
                        <h3 className="font-bold text-sm">
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(service.price))}
                        </h3>
                      </div>

                      {date && (
                        <div className="flex justify-between text-sm">
                          <h3 className="text-gray-400">Data</h3>
                          <h4 className="text-gray-400">
                            {format(date, "dd 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </h4>
                        </div>
                      )}

                      {hour && (
                        <div className="flex justify-between text-sm">
                          <h3 className="text-gray-400">Horário</h3>
                          <h4 className="text-gray-400">{hour}</h4>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <h3 className="text-gray-400">Estabelecimento</h3>
                        <h4 className="text-gray-400">{establishment.name}</h4>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <SheetFooter className="px-5">
                  <Button
                    onClick={bookingSubmit}
                    disabled={!date || !hour || submitIsLoading}
                  >
                    {submitIsLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirmar reserva
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
