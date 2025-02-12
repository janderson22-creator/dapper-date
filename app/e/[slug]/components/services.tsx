"use client";

import { Button } from "@/app/components/ui/button";
import { Establishment, Service } from "@prisma/client";
import React, { Key, useState } from "react";
import ServiceItem from "./service-item";
import EstablishmentInfo from "./establishment-info";

interface Props {
  establishment: Establishment;
  HasUser: boolean | undefined;
}

const Services: React.FC<Props> = ({ establishment, HasUser }) => {
  const services: Service[] = establishment.services;
  const [optionSelected, setOptionSelected] = useState<Options>("serviços");

  return (
    <div>
      <div className="px-5">
        {options.map((option, index) => (
          <Button
            className="capitalize ml-2.5 first-of-type:ml-0"
            variant={option === optionSelected ? "default" : "secondary"}
            onClick={() => setOptionSelected(option as Options)}
            key={index}
          >
            {option}
          </Button>
        ))}
      </div>

      {optionSelected === "serviços" && (
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-4 px-5 pt-6">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              service={service}
              establishment={establishment}
              isAuthenticated={HasUser}
            />
          ))}
        </div>
      )}

      {optionSelected === "informações" && (
        <div className="flex flex-col gap-3 px-5 pt-6">
          <EstablishmentInfo establishment={establishment} />
        </div>
      )}
    </div>
  );
};

export default Services;

type Options = "serviços" | "informações";
const options = ["serviços", "informações"];
