import BookingItem from "@/app/components/booking-item";
import { db } from "@/app/lib/prisma";
import { Booking } from "@prisma/client";
import React from "react";

interface AdminPageProps {
  params: {
    id?: string;
  };
}

const AdminPage: React.FC<AdminPageProps> = async ({ params }) => {

//   const bookings: Booking = await db.booking.findMany({
//     where: {
//       establishmentId: params.id,
//     },
//     include: {
//       service: true,
//       establishment: true,
//       employee: true,
//     },
//   });

  return (
    <div className="flex flex-col gap-4 mt-10 px-5">
      {/* {bookings.map((booking: Booking, index: React.Key | null | undefined) => (
        <BookingItem booking={booking} key={index} />
      ))} */}
    </div>
  );
};

export default AdminPage;
