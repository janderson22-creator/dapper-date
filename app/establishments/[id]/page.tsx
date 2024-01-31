import { Button } from "@/app/components/ui/button";
import { db } from "@/app/lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import EstablishmentInfo from "./components/establishment-info";

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

  const establishment = await db.establishment.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!establishment) {
    // TODO: redirect to home page
    return null;
  }

  return <EstablishmentInfo establishment={establishment} />;
};

export default EstablishmentDetailsPage;
