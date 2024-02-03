"use server";

import { db } from "@/app/lib/prisma";

interface SaveBookingParams {
  establishmentId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      establishmentId: params.establishmentId,
    },
  });

  // revalidatePath("/");
  // revalidatePath("/bookings");
};