import { getServerSession } from "next-auth";
import Header from "../components/header";
import { redirect } from "next/navigation";
import { db } from "../lib/prisma";
import BookingItem from "../components/booking-item";
import { Key } from "react";
import { Booking } from "@prisma/client";
import { authOptions } from "../lib/auth";
import { AlertCircle } from "lucide-react";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        establishment: true,
        employee: true,
      },
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        establishment: true,
        employee: true,
      },
    }),
  ]);

  confirmedBookings.sort(
    (
      a: { date: string | number | Date },
      b: { date: string | number | Date }
    ) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {!confirmedBookings.length && !finishedBookings.length && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
            <AlertCircle width={80} height={80} stroke="red" />
            <p className="font-semibold mt-4">Não possui agendamentos ainda!</p>
          </div>
        )}

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">
              Confirmados
            </h2>
            <div className="flex flex-col gap-3">
              {confirmedBookings.map(
                (booking: Booking, index: Key | null | undefined) => (
                  <BookingItem booking={booking} key={index} />
                )
              )}
            </div>
          </>
        )}

        {finishedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">
              Finalizados
            </h2>
            <div className="flex flex-col gap-3">
              {finishedBookings.map(
                (booking: Booking, index: Key | null | undefined) => (
                  <BookingItem booking={booking} key={index} />
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
