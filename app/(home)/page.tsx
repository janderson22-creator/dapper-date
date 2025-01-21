import { format } from "date-fns";
import Header from "../components/screens/header";
import { ptBR } from "date-fns/locale";
import Search from "./components/search";
import BookingItem from "../components/booking-item";
import { db } from "../lib/prisma";
import EstablishmentItem from "./components/establishment-item";
import { Key } from "react";
import { Booking, Establishment, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import HeaderWeb from "../components/ui/header-web";
import { organizeListByDate } from "../utils/organizeListByDate";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [establishments, confirmedBookings] = await Promise.all([
    db.establishment.findMany(),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as User).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            establishment: true,
            employee: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />
      <HeaderWeb />

      <div className="max-w-[1280px] m-auto">
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

        <div className="px-5 mt-6 lg:w-5/12">
          <Search />
        </div>

        <div className="mt-6">
          {confirmedBookings.length > 0 && (
            <>
              <h2 className="pl-3 text-xs lg:text-lg uppercase text-gray-400 font-bold mb-3">
                Proximos agendamentos
              </h2>

              <div className="px-3 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block lg:pb-4 scrollbar-modify">
                {organizeListByDate(confirmedBookings).map(
                  (booking: Booking, index: Key | null | undefined) => (
                    <BookingItem booking={booking} key={index} />
                  )
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 lg:mt-8">
          <h2 className="px-3 text-xs lg:text-lg uppercase text-gray-400 font-bold mb-3 lg:mb-5">
            Recomendados
          </h2>

          <div className="flex flex-col lg:flex-row lg:flex-wrap px-5 gap-2 lg:gap-10 lg:ml-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {establishments.map(
              (establishment: Establishment, key: Key | null | undefined) => (
                <EstablishmentItem key={key} establishment={establishment} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
