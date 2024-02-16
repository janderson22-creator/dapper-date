"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Admin, Booking, Employee } from "@prisma/client";
import { Loader2 } from "lucide-react";
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

interface ChooseEmployeeProps {
  paramsId: string | undefined;
  bookings: Booking;
}

const ChosseEmployee: React.FC<ChooseEmployeeProps> = ({
  paramsId,
  bookings,
}) => {
  const [loadingAdmin, setLoadingAdmin] = useState<boolean>(true);
  const [employees, setEmployees] = useState<Employee[]>();
  const [currentDate, setCurrentDate] = useState<string>("");
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

    const currentDate = format(new Date(), "dd/MM/yyyy");
    setCurrentDate(currentDate);
  }, [fetchListEmployees, paramsId]);

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  }

  const bookingsByEmployeeAndDateSelected = useMemo(() => {
    return bookings.filter((booking: Booking) => {
      const bookingDateFormatted = formatDate(booking.date);

      return (
        booking.employeeId === employeeSelected &&
        bookingDateFormatted === currentDate
      );
    });
  }, [bookings, employeeSelected, currentDate]);

  return (
    <div>
      {loadingAdmin ? (
        <div className="flex items-center justify-center m-auto h-[80vh]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <div>
          <p className="text-center font-bold text-2xl mb-5">{currentDate}</p>

          {employees?.map((employee, index) => (
            <div
              className="cursor-pointer"
              onClick={() => setEmployeeSelected(employee.id)}
              key={index}
            >
              {employee.name}
            </div>
          ))}

          <div>
            {bookingsByEmployeeAndDateSelected &&
              bookingsByEmployeeAndDateSelected.map(
                (booking: Booking, index: React.Key | null | undefined) => (
                  <BookingAdminItem booking={booking} key={index} />
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChosseEmployee;
