"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Service } from "@prisma/client";
import Image from "next/image";

interface ServiceItemProps {
  service: Service;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  return (
    <Card onClick={() => console.log(service)}>
      <CardContent className="flex items-center gap-4 p-3">
        <Image
          src={service.imageUrl}
          alt={""}
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover rounded-lg min-w-[110px] min-h-[110px] max-w-[110px] max-h-[110px]"
        />

        <div className="flex flex-col w-full">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm text-gray-400">{service.description}</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-primary font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Button variant="secondary">Reservar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
