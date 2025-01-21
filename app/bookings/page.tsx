"use client";

import Header from "../components/screens/header";
import BookingItem from "../components/booking-item";
import { Key, useCallback, useEffect, useState } from "react";
import { Booking } from "@prisma/client";
import { CalendarX2 } from "lucide-react";
import { getBookings } from "../actions/get-bookings";
import LoadingBookings from "./loading";
import HeaderWeb from "../components/ui/header-web";
import { organizeListByDate } from "../utils/organizeListByDate";

const BookingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking>();
  const [finishedBookings, setFinishedBookings] = useState<Booking>();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const bookings: Booking = await getBookings();

      setConfirmedBookings(bookings.confirmedBookings);
      setFinishedBookings(bookings.finishedBookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <>
      <Header />
      <HeaderWeb />

      <div className="max-w-[1280px] m-auto">
        {loading ? (
          <LoadingBookings />
        ) : (
          <div>
            <div className="px-5 py-6">
              <h1 className="text-xl lg:text-xl font-bold">Agendamentos</h1>

              {!confirmedBookings?.length && !finishedBookings?.length && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)]">
                  <CalendarX2
                    width={50}
                    height={50}
                    stroke="red"
                    className="opacity-65"
                  />
                  <p className="font-semibold mt-4">
                    Não possui agendamentos ainda!
                  </p>
                </div>
              )}

              {confirmedBookings?.length > 0 && (
                <>
                  <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">
                    Confirmados
                  </h2>
                  <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between gap-y-3">
                    {organizeListByDate(confirmedBookings).map(
                      (booking: Booking, index: Key | null | undefined) => (
                        <BookingItem booking={booking} key={index} />
                      )
                    )}
                  </div>
                </>
              )}

              {finishedBookings?.length > 0 && (
                <>
                  <h2 className="text-gray-400 font-bold uppercase text-sm lg:text-base mt-6 mb-3">
                    Finalizados
                  </h2>
                  <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between gap-y-3">
                    {organizeListByDate(finishedBookings).map(
                      (booking: Booking, index: Key | null | undefined) => (
                        <BookingItem booking={booking} key={index} />
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsPage;
