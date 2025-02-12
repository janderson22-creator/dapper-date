"use server";

import { getServerSession } from "next-auth";
import { db } from "../lib/prisma";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@prisma/client";

export const getBookings = async () => {
  const session: Session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        establishment: true,
        employee: true,
        user: true,
      },
    }),
    db.booking.findMany({
      where: {
        userId: session.user.id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        establishment: true,
        employee: true,
        user: true,
      },
    }),
  ]);

  return {
    confirmedBookings,
    finishedBookings,
  };
};
