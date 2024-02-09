"use client";

import { Button } from "@/app/components/ui/button";
import { Establishment, OpeningHour } from "@prisma/client";
import { Smartphone } from "lucide-react";
import { Key, useState } from "react";
import { toast } from "sonner";

interface Props {
  establishment: Establishment;
}

const EstablishmentInfo: React.FC<Props> = ({ establishment }) => {

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(establishment.phoneNumber);
    
    toast.success("Copiado!", {
      duration: 6000,
      position: "top-center",
      description: "Cole onde desejar.",
    });
  };

  return (
    <div>
      <p className="text-gray-400 font-bold uppercase">sobre nós</p>

      <p className="text-sm mt-3">{establishment.description}</p>

      <div className="flex items-center justify-between border-y border-secondary py-2 my-6">
        <div className="flex items-center gap-2.5">
          <Smartphone />
          <p className="text-sm">{establishment.phoneNumber}</p>
        </div>

        <Button variant="secondary" onClick={copyPhoneNumber}>
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
