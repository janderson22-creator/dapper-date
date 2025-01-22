"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Admin, Booking, Employee } from "@prisma/client";
import { ArrowDown, Loader2 } from "lucide-react";
import { getEmployees } from "../actions/employee/get-employees";
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
import { cn } from "@/app/utils/cn";
import { organizeListByDate } from "@/app/utils/organizeListByDate";
import { DatePicker } from "@/app/components/datePicker";

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

  return (
    <div>
      {loadingAdmin ? (
        <div className="flex items-center justify-center m-auto h-[80vh]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <div>
          <h2 className="text-xs uppercase text-gray-400 font-bold mb-2">
            Selecione uma data
          </h2>
          <DatePicker
            isOpen={sheetIsOpen}
            setIsOpen={setSheetIsOpen}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />

          {employees && (
            <div>
              <h2 className="text-xs uppercase text-gray-400 font-bold my-2">
                Selecione um Profissional
              </h2>
              <div className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {employees?.map((employee, index) => (
                  <Card
                    onClick={() => setEmployeeSelected(employee.id)}
                    key={index}
                    className={cn(
                      "min-w-[180px] max-w-[180px] max-h-[280px] rounded-2xl cursor-pointer",
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

          {bookingsByEmployeeAndDateSelected.length > 0 ? (
            <div className="flex flex-col mt-5">
              <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
                Agendamentos
              </h2>

              <div className="flex flex-col gap-4">
                {organizeListByDate(bookingsByEmployeeAndDateSelected).map(
                  (booking: Booking, index: React.Key | null | undefined) => (
                    <BookingAdminItem booking={booking} key={index} />
                  )
                )}
              </div>
            </div>
          ) : (
            employeeSelected && (
              <div className="flex items-center justify-center mt-5">
                <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
                  Nenhum agendamento por enquanto!
                </h2>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ChosseEmployee;
