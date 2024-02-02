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
import { Establishment, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "../helpers/hours";
import { format } from "date-fns";

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
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<string | undefined>();

  const dateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const bookingClick = () => {
    if (!isAuthenticated) {
      console.log("logando");

      return signIn("google");
    }

    console.log("logado");
    // TODO: abrir modal de agendamento
  };

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

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
            <Sheet>
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

                {/* Mostrar lista de horários apenas se alguma data estiver selecionada */}

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
                  <Button>Confirmar reserva</Button>
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
