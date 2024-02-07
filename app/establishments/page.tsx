import { Key } from "react";
import EstablishmentItem from "../(home)/components/establishment-item";
import Header from "../components/header";
import { db } from "../lib/prisma";
import { Establishment } from "@prisma/client";
import { redirect } from "next/navigation";
import Search from "../(home)/components/search";

interface EstablishmentPageProps {
  searchParams: {
    search?: string;
  };
}

const EstablishmentsPage: React.FC<EstablishmentPageProps> = async ({
  searchParams,
}) => {
  if (!searchParams.search) {
    return redirect("/");
  }

  const establishments = await db.establishment.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <div>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search
          defaultValues={{
            search: searchParams.search,
          }}
        />
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className="flex flex-wrap gap-3 mt-3">
          {establishments.map(
            (establishment: Establishment, index: Key | null | undefined) => (
              <EstablishmentItem establishment={establishment} key={index} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EstablishmentsPage;
