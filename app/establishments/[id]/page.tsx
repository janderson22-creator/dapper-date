import { db } from "@/app/lib/prisma";
import EstablishmentInfo from "./components/establishment-info";
import ServiceItem from "./components/service-item";
import { Key } from "react";
import { Establishment, Service } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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
    },
  });


  if (!establishment) {
    return null;
  }

  return (
    <div>
      <EstablishmentInfo establishment={establishment} />

      <div className="flex flex-col gap-3 px-5 pt-6">
        {establishment.services?.map(
          (service: Service, index: Key | null | undefined) => (
            <ServiceItem
              key={index}
              service={service}
              establishment={establishment}
              isAuthenticated={!!session?.user}
            />
          )
        )}
      </div>
    </div>
  );
};

export default EstablishmentDetailsPage;
