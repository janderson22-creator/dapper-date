"use server";

import { db } from "../../../lib/prisma";

type Props = {
  establishmentId: string;
  employeesId: string[];
  initialDate: Date;
  endDate: Date;
};

export const getBookingsByEmployee = async ({ establishmentId, employeesId, initialDate, endDate }: Props) => {
  const bookings = await db.booking.findMany({
    where: {
      establishmentId,
      employeeId: {
        in: employeesId,
      },
      date: {
        gte: initialDate,
        lt: endDate,
      },
    },
    include: {
      user: true,
    },
  });

  return bookings;
};
