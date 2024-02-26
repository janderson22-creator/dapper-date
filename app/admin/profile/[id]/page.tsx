import EstablishmentHeader from "@/app/establishments/[id]/components/establishment-header";
import { Establishment } from "@prisma/client";
import { db } from "@/app/lib/prisma";
import EstablishmentAdminInfo from "../components/establishment-infos";

interface ProfileProps {
  params: {
    id?: string;
  };
}

const Profile: React.FC<ProfileProps> = async ({ params }) => {
  if (!params.id) {
    return null;
  }

  const establishment: Establishment = await db.establishment.findUnique({
    where: {
      id: params.id,
    },
    include: {
      openingHours: true,
    },
  });

  if (!establishment) {
    return null;
  }

  return (
    <div>
      <EstablishmentHeader admin={true} establishment={establishment} />

      <EstablishmentAdminInfo establishment={establishment} />
    </div>
  );
};

export default Profile;
