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
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../actions/get-day-bookings";
import EmployeeItem from "./employee-item";
import { cn } from "@/app/lib/utils";
import sendWhatsAppMessage from "../helpers/send-message-whatsapp";

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
  const [loadingEmployeeSelected, setLoadingEmployeeSelected] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState<
    Employee | undefined
  >();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [sheetConfirmIsOpen, setSheetConfirmIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking>([]);
  const [booking, setBooking] = useState<Date | undefined>();

  const getDayOfWeek = (date: Date): string => {
    const daysOfWeek = [
      "domingo",
      "segunda-feira",
      "terca-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sabado",
    ];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };

  const getOpeningHourByDay = useMemo(() => {
    if (!date) return undefined;

    const selectedDayOfWeek = getDayOfWeek(date);

    const openingHoursForSelectedDay = establishment.openingHours.find(
      (openingHour: OpeningHour) => openingHour.dayOfWeek === selectedDayOfWeek
    );

    return openingHoursForSelectedDay.startTime
      ? openingHoursForSelectedDay
      : undefined;
  }, [date, establishment.openingHours]);

  useEffect(() => {
    if (!date || getOpeningHourByDay) return;
    const selectedDayOfWeek = getDayOfWeek(date);

    toast.error(
      `O estabelecimento ${establishment.name} não funciona ${selectedDayOfWeek}`
    );
  }, [date, establishment, establishment.name, getOpeningHourByDay]);

  // get available hours of date selected
  useEffect(() => {
    if (!date || !employeeSelected) return;
    // TODO: GET DAY BOOKINGS BY EMPLOYEE ID
    const refreshAvailableHours = async () => {
      const bookingsDay = await getDayBookings(
        date,
        establishment.id,
        employeeSelected.id
      );

      setDayBookings(bookingsDay);
    };

    refreshAvailableHours();
  }, [date, employeeSelected, establishment.id, getOpeningHourByDay]);

  const dateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
    setEmployeeSelected(undefined);
  };

  const loginClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

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

  const changeEmployee = useCallback(async (employee: Employee) => {
    setLoadingEmployeeSelected(true);
    try {
      setHour(undefined);
      setEmployeeSelected(employee);
    } finally {
      setLoadingEmployeeSelected(false);
    }
  }, []);

  const timeList = useMemo(() => {
    if (
      !date ||
      !getOpeningHourByDay ||
      loadingEmployeeSelected ||
      !employeeSelected
    )
      return [];

    const startTimeFormatted = parseInt(
      getOpeningHourByDay.startTime.split(":")[0]
    );
    const endTimeFormatted = parseInt(
      getOpeningHourByDay.endTime.split(":")[0]
    );

    const pauseAtFormatted = parseInt(
      getOpeningHourByDay.pauseAt.split(":")[0]
    );
    const backAtFormatted = parseInt(getOpeningHourByDay.backAt.split(":")[0]);

    return generateDayTimeList(
      date,
      startTimeFormatted,
      endTimeFormatted
    ).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      // Verifica se o horário está dentro do intervalo de pausa
      if (pauseAtFormatted <= timeHour && timeHour < backAtFormatted) {
        return false; // Ignora horários dentro do intervalo de pausa
      }

      // Verifica se há uma reserva para o horário atual
      const bookingList = dayBookings.find((booking: Booking) => {
        const bookingHour = booking?.date.getHours();
        const bookingMinutes = booking?.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      return !bookingList;
    });
  }, [
    date,
    dayBookings,
    employeeSelected,
    getOpeningHourByDay,
    loadingEmployeeSelected,
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
  }, [sheetConfirmIsOpen]);

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
            <p className="text-sm text-primary font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary">Reservar</Button>
              </SheetTrigger>

              {!isAuthenticated ? (
                <SheetContent side="bottom" className="p-0 pb-10 lg:rounded-lg rounded-t-lg w-full lg:w-10/12 lg:left-0 lg:right-0 lg:top-0 lg:bottom-0 lg:m-auto h-fit">
                  <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="flex items-center mt-10">
                    <Button
                      onClick={loginClick}
                      className="mx-auto"
                    >
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

                  {getOpeningHourByDay && (
                    <div className="border-t border-secondary py-4">
                      <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold mb-3">
                        Selecione um profissional
                      </h2>
                      <div
                        className={cn(
                          "flex gap-3 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden",
                          establishment.employees.length <= 2 &&
                            "items-center justify-center"
                        )}
                      >
                        {establishment.employees.map(
                          (
                            employee: Employee,
                            index: Key | null | undefined
                          ) => (
                            <EmployeeItem
                              employeeSelected={employeeSelected}
                              setEmployeeSelected={changeEmployee}
                              employee={employee}
                              key={index}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {employeeSelected && (
                    <div className="border-t border-secondary py-4">
                      <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold mb-3">
                        Selecione um horário
                      </h2>
                      <div className="flex gap-3 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {!loadingEmployeeSelected && timeList.length ? (
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
                            Não possui mais horários disponiveis para este dia.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {!isAuthenticated && (
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

                      <SheetContent side="bottom">
                        <div className="py-4 mt-2">
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
