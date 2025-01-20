import { db } from "@/app/lib/prisma";
import { Establishment, Service } from "@prisma/client";
import HeaderAdmin from "../../components/header-admin";
import ServiceItemAdmin from "../components/service-item-admin";

interface EmployeesPageProps {
  params: {
    id?: string;
  };
}

const Services: React.FC<EmployeesPageProps> = async ({ params }) => {
  const establishment: Establishment = await db.establishment.findUnique({
    where: {
      id: params.id,
    },
  });

  const services: Service = await db.service.findMany({
    where: {
      establishmentId: params.id,
    },
    include: {
      booking: true,
    },
  });

  return (
    <div>
      <HeaderAdmin paramsId={params.id} />

      <div className="flex flex-col gap-3 px-5 pt-4">
        <ServiceItemAdmin establishment={establishment} services={services} />
      </div>
    </div>
  );
};

export default Services;
