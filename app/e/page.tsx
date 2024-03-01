import { Key } from "react";
import EstablishmentItem from "../(home)/components/establishment-item";
import Header from "../components/header";
import { db } from "../lib/prisma";
import { Establishment } from "@prisma/client";
import { redirect } from "next/navigation";
import Search from "../(home)/components/search";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

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
        <div className="flex items-center w-full">
          <Link className="flex items-center justify-center border w-10 h-10 rounded-lg mr-2" href="/">
            <ChevronLeftIcon />
          </Link>
          <Search
            defaultValues={{
              search: searchParams.search,
            }}
          />
        </div>
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          {!establishments.length && "Não houve "}Resultados para &quot;
          {searchParams.search}&quot;
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
