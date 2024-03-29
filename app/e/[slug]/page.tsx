"use client";

import { Admin, Establishment, Service } from "@prisma/client";
import EstablishmentHeader from "./components/establishment-header";
import Services from "./components/services";
import { useCallback, useEffect, useState } from "react";
import { getEstablishment } from "@/app/actions/get-establishment";
import EstablishmentSkeleton from "./components/establishment-skeleton";
import { useRouter } from "next/navigation";

interface EstablishmentDetailsPageProps {
  params: {
    slug?: string;
  };
}

const EstablishmentDetailsPage: React.FC<EstablishmentDetailsPageProps> = ({
  params,
}) => {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentEstablishment, setCurrentEstablishment] =
    useState<Establishment>();
  const [hasUser, setHasUser] = useState<boolean>();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminJson = localStorage.getItem("admin");

      if (!adminJson) return;

      const admin: Admin = JSON.parse(adminJson);
      if (admin) {
        route.push(`/admin/${admin.establishmentId}`);
        return;
      }
    }
  }, [route]);

  const fetchEstablishment = useCallback(async () => {
    if (!params.slug) return null;
    setLoading(true);
    try {
      const establishment: Establishment = await getEstablishment(params.slug);

      if (!establishment.establishment) return route.replace("/");
      setCurrentEstablishment(establishment.establishment);
      setHasUser(!!establishment.session);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.slug, route]);

  useEffect(() => {
    fetchEstablishment();
  }, [fetchEstablishment]);

  if (loading) {
    return <EstablishmentSkeleton />;
  }

  if (!currentEstablishment) return;

  return (
    <div>
      <EstablishmentHeader admin={false} establishment={currentEstablishment} />

      <div className="m-auto max-w-[1280px]">
        <div className="pt-5">
          <Services establishment={currentEstablishment} HasUser={hasUser} />
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDetailsPage;
