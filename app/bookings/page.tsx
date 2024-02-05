import { getServerSession } from "next-auth";
import Header from "../components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../lib/prisma";
import BookingItem from "../components/booking-item";
import { Key } from "react";
import { Booking } from "@prisma/client";
import { isFuture, isPast } from "date-fns";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      establishment: true,
    },
  });

  const confirmedBookings = bookings.filter((booking: { date: Booking }) =>
    isFuture(booking.date)
  );
  const finishedBookings = bookings.filter((booking: { date: Booking }) =>
    isPast(booking.date)
  );

  return (
    <div>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking: Booking, index: Key | null | undefined) => (
            <BookingItem booking={booking} key={index} />
          ))}
        </div>

        <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking: Booking, index: Key | null | undefined) => (
            <BookingItem booking={booking} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
