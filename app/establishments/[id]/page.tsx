import { Button } from "@/app/components/ui/button";
import { db } from "@/app/lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import EstablishmentInfo from "./components/establishment-info";
import ServiceItem from "./components/service-item";
import { Key } from "react";
import { Establishment, Service } from "@prisma/client";

interface EstablishmentDetailsPageProps {
  params: {
    id?: string;
  };
}

const EstablishmentDetailsPage: React.FC<
  EstablishmentDetailsPageProps
> = async ({ params }) => {
  if (!params.id) {
    // TODO: redirect to home page
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
    // TODO: redirect to home page
    return null;
  }

  return (
    <div>
      <EstablishmentInfo establishment={establishment} />

      <div className="flex flex-col gap-3 px-5 pt-6">
        {establishment.services?.map(
          (service: Service, index: Key | null | undefined) => (
            <ServiceItem key={index} service={service} />
          )
        )}
      </div>
    </div>
  );
};

export default EstablishmentDetailsPage;
