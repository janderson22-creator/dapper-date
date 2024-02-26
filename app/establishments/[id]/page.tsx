import { db } from "@/app/lib/prisma";
import ServiceItem from "./components/service-item";
import { Key } from "react";
import { Establishment, Service } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import EstablishmentHeader from "./components/establishment-header";
import Services from "./components/services";

interface EstablishmentDetailsPageProps {
  params: {
    id?: string;
  };
}

const EstablishmentDetailsPage: React.FC<
  EstablishmentDetailsPageProps
> = async ({ params }) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    return null;
  }

  const establishment: Establishment = await db.establishment.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
      openingHours: true,
      employees: true
    },
  });

  if (!establishment) {
    return null;
  }

  return (
    <div>
      <EstablishmentHeader admin={false} establishment={establishment} />

      <div className="pt-5">
        <Services establishment={establishment} HasUser={!!session?.user} />
      </div>
    </div>
  );
};

export default EstablishmentDetailsPage;
