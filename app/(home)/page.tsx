import { format, isFuture } from "date-fns";
import Header from "../components/header";
import { ptBR } from "date-fns/locale";
import Search from "./components/search";
import BookingItem from "../components/booking-item";
import { db } from "../lib/prisma";
import EstablishmentItem from "./components/establishment-item";
import { Key } from "react";
import { Booking, Establishment } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [establishments, confirmedBookings] = await Promise.all([
    db.establishment.findMany({}),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            establishment: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Óla, ${session.user.name?.split(" ")[0]}!`
            : "Óla, vamos agendar um serviço?"}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="pl-3 text-xs uppercase text-gray-400 font-bold mb-3">
              Agendamentos
            </h2>

            <div className="px-3 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map(
                (booking: Booking, index: Key | null | undefined) => (
                  <BookingItem booking={booking} key={index} />
                )
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>

        <div className="flex px-5 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {establishments.map(
            (establishment: Establishment, key: Key | null | undefined) => (
              <EstablishmentItem key={key} establishment={establishment} />
            )
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>

        <div className="flex px-5 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {establishments
            .slice()
            .reverse()
            .map(
              (establishment: Establishment, key: Key | null | undefined) => (
                <EstablishmentItem key={key} establishment={establishment} />
              )
            )}
        </div>
      </div>
    </div>
  );
}
