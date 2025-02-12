"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import {
  Booking,
  Employee,
  Establishment,
  OpeningHour,
  Service,
} from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMinutes,
  format,
  isAfter,
  isToday,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { saveBooking } from "../actions/save-booking";
import { ArrowDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../actions/get-day-bookings";
import EmployeeItem from "./employee-item";
import { cn } from "@/app/utils/cn";
import sendWhatsAppMessage from "../helpers/send-message-whatsapp";
import { DAYS_OF_WEEK_ORDER } from "@/app/utils/daysOfWeek";

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
  const employees: Employee[] = establishment.employees;
  const openingHour: OpeningHour[] = establishment.openingHours;
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<string | undefined>();
  const [employeeSelected, setEmployeeSelected] = useState<
    Employee | undefined
  >();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [sheetDateIsOpen, setSheetDateIsOpen] = useState(false);
  const [sheetConfirmIsOpen, setSheetConfirmIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking>([]);
  const [booking, setBooking] = useState<Date | undefined>();
  const dayOfWeek = date ? DAYS_OF_WEEK_ORDER[date.getDay()] : undefined;

  const openingHourBySelectedDay = useMemo(() => {
    if (!date) return undefined;

    return openingHour.find((oh) => oh.dayOfWeek === dayOfWeek);
  }, [date, dayOfWeek, openingHour]);

  useEffect(() => {
    if (date && employeeSelected) {
      getDayBookings(date, establishment.id, employeeSelected.id)
        .then(setDayBookings)
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [date, employeeSelected, establishment.id, openingHourBySelectedDay]);

  const timeList = useMemo(() => {
    if (!date || !openingHourBySelectedDay || !employeeSelected) return [];

    const { startTime, endTime, pauseAt, backAt } = openingHourBySelectedDay;

    const start = parse(startTime, "HH:mm", date);
    const end = parse(endTime, "HH:mm", date);
    const pause = pauseAt ? parse(pauseAt, "HH:mm", date) : null;
    const back = backAt ? parse(backAt, "HH:mm", date) : null;

    let listHours = [];
    let current = start;

    const getServiceDuration = (time: Date) => {
      const booking = dayBookings.find((booking: Booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();
        const timeHour = time.getHours();
        const timeMinutes = time.getMinutes();
        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });
      return booking?.service?.duration || 30;
    };

    while (current <= end) {
      if (!pause || !back || current < pause || current >= back) {
        listHours.push(current);
      }

      const intervalMinutes = getServiceDuration(current);
      current = addMinutes(current, intervalMinutes);

      if (pause && back && current > pause && current < back) {
        current = back;
      }
    }

    const isBooked = (time: Date) => {
      return dayBookings.some((booking: Booking) => {
        const bookingHour = booking?.date.getHours();
        const bookingMinutes = booking?.date.getMinutes();
        const timeHour = time.getHours();
        const timeMinutes = time.getMinutes();
        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });
    };

    listHours = listHours.filter((time) => !isBooked(time));

    if (isToday(date)) {
      const now = new Date();
      listHours = listHours
        .filter((time) => isAfter(time, now))
        .map((time) => format(time, "HH:mm"));
    } else {
      listHours = listHours.map((time) => format(time, "HH:mm"));
    }

    return listHours;
  }, [date, dayBookings, employeeSelected, openingHourBySelectedDay]);

  const bookingSubmit = useCallback(async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !employeeSelected || !data?.user) {
        return;
      }
      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        employeeId: employeeSelected.id,
        userId: (data.user as any).id,
        serviceId: service.id,
        establishmentId: establishment.id,
        date: newDate,
      });

      setBooking(newDate);

      toast.success("Reserva realizada com sucesso!", {
        duration: 6000,
        position: "top-center",
        description: format(newDate, "'Para' dd 'de' MMMM 'ás' HH':'mm'", {
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
  }, [
    data?.user,
    date,
    employeeSelected,
    establishment.id,
    hour,
    router,
    service.id,
  ]);

  const sendMessage = () => {
    if (!booking) return;

    const message = `Nova reserva para ${
      employeeSelected.name
    } foi realizada com sucesso para ${format(
      booking,
      "'o dia' dd 'de' MMMM 'ás' HH:mm",
      {
        locale: ptBR,
      }
    )}.`;
    const whatsappNumber = establishment.phoneNumber;

    sendWhatsAppMessage(whatsappNumber, message);
    setSheetConfirmIsOpen(false);
    setBooking(undefined);
    setHour(undefined);
    setDate(undefined);
  };

  useEffect(() => {
    if (sheetConfirmIsOpen) return;

    setBooking(undefined);
    setBooking(undefined);
    setHour(undefined);
    setDate(undefined);
    setEmployeeSelected(undefined);
  }, [sheetConfirmIsOpen]);

  const dateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
    setEmployeeSelected(undefined);
    setSheetDateIsOpen(false);
  };

  const loginClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  return (
    <Card className="lg:max-w-[350px]">
      <CardContent className="flex items-center gap-4 p-3">
        <Image
          src={service.imageUrl || ""}
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
            <p className="text-sm text-primary font-bold">R$ {service.price}</p>
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary">Reservar</Button>
              </SheetTrigger>

              {!isAuthenticated ? (
                <SheetContent
                  side="bottom"
                  className="p-0 pb-10 lg:rounded-lg rounded-t-lg w-full lg:w-fit lg:left-0 lg:right-0 lg:top-0 lg:bottom-0 lg:m-auto h-fit"
                >
                  <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="flex items-center lg:items-start lg:px-20 mt-10">
                    <Button onClick={loginClick} className="mx-auto">
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Fazer Login para continuar
                    </Button>
                  </div>
                </SheetContent>
              ) : (
                <SheetContent className="p-0 w-10/12">
                  <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  {/* React Day Picker Below */}

                  <h2 className="text-xs uppercase text-gray-400 font-bold mt-4 mb-2 pl-4">
                    Data
                  </h2>
                  <Sheet
                    open={sheetDateIsOpen}
                    onOpenChange={setSheetDateIsOpen}
                  >
                    <div className="px-10">
                      <SheetTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full font-bold text-3x1 mb-5 tracking-widest flex items-center"
                        >
                          <p className="ml-auto">
                            {date
                              ? format(date, "dd/MM/yyyy")
                              : "Selecione uma data"}
                          </p>
                          <ArrowDown size={18} className="ml-auto" />
                        </Button>
                      </SheetTrigger>
                    </div>

                    <SheetContent
                      className="p-0 lg:left-0 lg:right-0 lg:top-0 lg:bottom-0 lg:m-auto lg:w-4/12 lg:rounded-lg lg:h-fit"
                      side="bottom"
                    >
                      <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                        <SheetTitle>Selecione um dia</SheetTitle>
                      </SheetHeader>

                      {/* React Day Picker Below */}

                      <div className="py-2">
                        <Calendar
                          showOutsideDays={false}
                          className="w-full h-[50%]"
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
                    </SheetContent>
                  </Sheet>

                  {date && !openingHourBySelectedDay && (
                    <div className="text-center font-semibold px-4">
                      O estabelecimento {establishment.name} não funciona{" "}
                      {dayOfWeek}!
                    </div>
                  )}

                  {openingHourBySelectedDay && (
                    <div className="border-t border-secondary py-4">
                      <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold mb-3">
                        Selecione um profissional
                      </h2>
                      <div
                        className={cn(
                          "flex gap-3 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block lg:pb-4",
                          employees.length <= 2 && "items-center justify-center"
                        )}
                      >
                        {employees.map((employee, index) => (
                          <EmployeeItem
                            employeeSelected={employeeSelected}
                            setEmployeeSelected={(employee) => {
                              setHour(undefined);
                              setEmployeeSelected(employee);
                            }}
                            employee={employee}
                            key={index}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {employeeSelected && (
                    <div className="border-t border-secondary py-4">
                      <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold mb-3">
                        Selecione um horário
                      </h2>
                      <div className="flex gap-3 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block lg:pb-4">
                        {timeList.length ? (
                          timeList.map((time, index) => (
                            <Button
                              onClick={() => setHour(time)}
                              variant={hour === time ? "default" : "outline"}
                              className="rounded-full"
                              key={index}
                            >
                              {time}
                            </Button>
                          ))
                        ) : (
                          <p className="text-sm text-center font-semibold text-red-400">
                            Estabelecimento fechado ou não possui mais horários
                            disponiveis para este dia.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {isAuthenticated && (
                    <Sheet
                      open={sheetConfirmIsOpen}
                      onOpenChange={setSheetConfirmIsOpen}
                    >
                      <SheetTrigger asChild>
                        <Button
                          className="absolute bottom-5 left-0 right-0 w-[87%] mx-auto"
                          disabled={
                            !date ||
                            !hour ||
                            submitIsLoading ||
                            !isAuthenticated
                          }
                        >
                          {submitIsLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Confirmar
                        </Button>
                      </SheetTrigger>

                      <SheetContent
                        side="bottom"
                        className="lg:bottom-0 lg:top-0 lg:left-0 lg:right-0 lg:w-4/12 lg:h-fit lg:m-auto lg:rounded-lg"
                      >
                        <div className="py-4 mt-2">
                          <Card>
                            <CardContent className="p-3 flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <h2 className="font-bold">{service.name}</h2>
                                <h3 className="font-bold text-sm">
                                  R$ {service.price}
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
                                <h3 className="text-gray-400">
                                  Estabelecimento
                                </h3>
                                <h4 className="text-gray-400">
                                  {establishment.name}
                                </h4>
                              </div>

                              {employeeSelected && (
                                <div className="flex justify-between text-sm">
                                  <h3 className="text-gray-400">
                                    Profissional
                                  </h3>
                                  <h4 className="text-gray-400">
                                    {employeeSelected.name}
                                  </h4>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        <Button
                          className="w-full"
                          onClick={bookingSubmit}
                          disabled={
                            !date ||
                            !hour ||
                            submitIsLoading ||
                            booking !== undefined
                          }
                        >
                          {submitIsLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {booking ? "Reserva confirmada" : "Confirmar reserva"}
                        </Button>

                        {booking && (
                          <SheetClose asChild>
                            <Button
                              className="w-full mt-3 bg-green-500 border-none"
                              onClick={() => sendMessage()}
                            >
                              Confirmar via whatsapp
                            </Button>
                          </SheetClose>
                        )}

                        {booking && (
                          <Button
                            variant="secondary"
                            className="w-full mt-3"
                            onClick={() => router.push("/bookings")}
                          >
                            Ver meus agendamentos
                          </Button>
                        )}
                      </SheetContent>
                    </Sheet>
                  )}
                </SheetContent>
              )}
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
