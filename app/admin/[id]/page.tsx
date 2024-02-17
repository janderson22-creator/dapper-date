import React from "react";
import ChosseEmployee from "../components/chosse-employee";
import { Booking } from "@prisma/client";
import { db } from "@/app/lib/prisma";

interface AdminPageProps {
  params: {
    id?: string;
  };
}

const AdminPage: React.FC<AdminPageProps> = async ({ params }) => {
  
  const bookings: Booking = await db.booking.findMany({
    where: {
      establishmentId: params.id,
    },
    include: {
      establishment: true,
      service: true,
      employee: true,
      user: true,
    },
  });

  return (
    <div className="mt-8 px-5">
      <ChosseEmployee bookings={bookings} paramsId={params.id} />
    </div>
  );
};

export default AdminPage;
