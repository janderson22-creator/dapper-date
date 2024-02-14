"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams {
  establishmentId: string;
  serviceId: string;
  userId: string;
  employeeId: string;
  date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      userId: params.userId,
      employeeId: params.employeeId,
      serviceId: params.serviceId,
      establishmentId: params.establishmentId,
      date: params.date,
    },
  });

  revalidatePath("/bookings");
  revalidatePath("/");
};
