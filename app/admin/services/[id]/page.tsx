import { db } from "@/app/lib/prisma";
import { Service } from "@prisma/client";
import HeaderAdmin from "../../components/header-admin";
import ServiceItemAdmin from "../components/service-item-admin";

interface EmployeesPageProps {
  params: {
    id?: string;
  };
}

const Services: React.FC<EmployeesPageProps> = async ({ params }) => {
  const services: Service = await db.service.findMany({
    where: {
      establishmentId: params.id,
    },
    include: {
      establishment: true,
    },
  });

  return (
    <div>
      <HeaderAdmin paramsId={params.id} />

      <div className="flex flex-col gap-3 px-5 pt-4">
        <ServiceItemAdmin services={services} paramsId={params.id} />
      </div>
    </div>
  );
};

export default Services;
