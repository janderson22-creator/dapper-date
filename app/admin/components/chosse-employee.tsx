"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Admin, Booking, Employee } from "@prisma/client";
import { ArrowDown, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { getEmployees } from "../actions/get-employees";
import { format } from "date-fns";
import BookingAdminItem from "./booking-admin-item";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Calendar } from "@/app/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface ChooseEmployeeProps {
  paramsId: string | undefined;
  bookings: Booking;
}

const ChosseEmployee: React.FC<ChooseEmployeeProps> = ({
  paramsId,
  bookings,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [employees, setEmployees] = useState<Employee[]>();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [employeeSelected, setEmployeeSelected] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminJson = localStorage.getItem("admin");

      if (!adminJson || !paramsId) {
        return router.push("/");
      }

      const admin: Admin = JSON.parse(adminJson);
      const isAdmin = paramsId === admin.establishmentId;

      if (!isAdmin) {
        return router.push("/");
      }

      setLoadingAdmin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListEmployees = useCallback(async () => {
    if (!paramsId) return null;
    try {
      const employees: Employee = await getEmployees(paramsId);

      setEmployees(employees);
    } catch (error) {
      console.error(error);
    }
  }, [paramsId]);

  useEffect(() => {
    if (!paramsId) return;
    fetchListEmployees();
  }, [fetchListEmployees, paramsId]);

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  }

  const bookingsByEmployeeAndDateSelected = useMemo(() => {
    const currentDateFormated = format(currentDate, "dd/MM/yyyy");

    return bookings.filter((booking: Booking) => {
      const bookingDateFormatted = formatDate(booking.date);

      return (
        booking.employeeId === employeeSelected &&
        bookingDateFormatted === currentDateFormated
      );
    });
  }, [bookings, currentDate, employeeSelected]);

  const dateClick = (date: Date | undefined) => {
    if (!date) return;

    setCurrentDate(date);
    setSheetIsOpen(false);
  };

  return (
    <div>
      {loadingAdmin ? (
        <div className="flex items-center justify-center m-auto h-[80vh]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <div>
          <div>
            <h2 className="text-xs uppercase text-gray-400 font-bold mb-2">
              Selecione uma data
            </h2>
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full font-bold text-3x1 mb-5 tracking-widest flex items-center"
                >
                  <p className="ml-auto">{format(currentDate, "dd/MM/yyyy")}</p>
                  <ArrowDown size={18} className="ml-auto" />
                </Button>
              </SheetTrigger>

              <SheetContent className="p-0" side="bottom">
                <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
                  <SheetTitle>Selecione um dia</SheetTitle>
                </SheetHeader>

                {/* React Day Picker Below */}

                <div className="py-2 h-full">
                  <Calendar
                    className="w-full h-[50%]"
                    mode="single"
                    selected={currentDate}
                    onSelect={dateClick}
                    locale={ptBR}
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

            {employees && (
              <div>
                <h2 className="text-xs uppercase text-gray-400 font-bold my-2">
                  Selecione um Profissional
                </h2>
                <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {employees?.map((employee, index) => (
                    <Card
                      onClick={() => setEmployeeSelected(employee.id)}
                      key={index}
                      className={cn(
                        "min-w-[160px] max-w-[160px] max-h-[280px] rounded-2xl",
                        employee.id === employeeSelected && "bg-primary"
                      )}
                    >
                      <CardContent className="flex flex-col items-center p-1">
                        <Image
                          src={employee.imageUrl}
                          alt={employee.name}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-[159px] rounded-2xl object-cover"
                        />

                        <p
                          className={cn(
                            "font-semibold mt-2",
                            employee.id === employeeSelected && "font-bold"
                          )}
                        >
                          {employee.name}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-normal text-gray-400",
                            employee.id === employeeSelected &&
                              "font-medium text-white"
                          )}
                        >
                          {employee.position}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {bookingsByEmployeeAndDateSelected.length > 0 && (
            <div className="flex flex-col mt-5">
              <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
                Agendamentos
              </h2>

              <div className="flex flex-col gap-4">
                {bookingsByEmployeeAndDateSelected.map(
                  (booking: Booking, index: React.Key | null | undefined) => (
                    <BookingAdminItem booking={booking} key={index} />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChosseEmployee;
