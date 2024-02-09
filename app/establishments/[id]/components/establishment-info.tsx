import { Button } from "@/app/components/ui/button";
import { Establishment, OpeningHour } from "@prisma/client";
import { Smartphone } from "lucide-react";
import { Key } from "react";

interface Props {
  establishment: Establishment;
}

const EstablishmentInfo: React.FC<Props> = ({ establishment }) => {
  return (
    <div>
      <p className="text-gray-400 font-bold uppercase">sobre nós</p>

      <p className="text-sm mt-3">
        Bem-vindo à Vintage Barber, onde tradição encontra estilo. Nossa equipe
        de mestres barbeiros transforma cortes de cabelo e barbas em obras de
        arte. Em um ambiente acolhedor, promovemos confiança, estilo e uma
        comunidade unida.
      </p>

      <div className="flex items-center justify-between border-y border-secondary py-2 my-6">
        <div className="flex items-center gap-2.5">
          <Smartphone />
          <p className="text-sm">(11) 98204-5108</p>
        </div>

        <Button variant="secondary">
          Copiar
        </Button>
      </div>

      <div className="pb-12">
        {establishment.openingHours.map(
          (item: OpeningHour, key: Key | null | undefined) => (
            <div
              className="text-sm flex items-center justify-between mb-2.5 last-of-type:mb-0"
              key={key}
            >
              <p className="text-gray-400">{item.dayOfWeek}</p>

              <div className="flex">
                <p>
                  {item.startTime
                    ? `${item.startTime} - ${item.endTime}`
                    : "Fechado"}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EstablishmentInfo;
