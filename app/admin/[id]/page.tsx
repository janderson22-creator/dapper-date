import React from "react";
import ChosseEmployee from "../components/chosse-employee";

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
      <ChosseEmployee paramsId={params.id} />
    </div>
  );
};

export default AdminPage;
