"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Switch } from "@/app/components/ui/switch";
import { Establishment, OpeningHour } from "@prisma/client";
import { ArrowDown, Smartphone } from "lucide-react";
import { Key, useCallback, useState } from "react";
import { toast } from "sonner";
import { updateOpeningHours } from "../../actions/opening-hours/update-opening-hour";

interface Props {
  establishment: Establishment;
}

const EstablishmentAdminInfo: React.FC<Props> = ({ establishment }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(establishment.phoneNumber);

    toast.success("Copiado!", {
      duration: 6000,
      position: "top-center",
      description: "Cole onde desejar.",
    });
  };

  const submitClick = useCallback(
    async (id: string, dayOff: boolean) => {
      try {
        await updateOpeningHours({
          id,
          startTime: dayOff ? "" : startTime,
          endTime: dayOff ? "" : endTime,
        });

        toast.success("Horário alterado com sucesso!", {
          duration: 4000,
          position: "top-center",
        });
      } catch (error) {
        console.error(error);
      }
    },
    [endTime, startTime]
  );

  const compareDaysOfWeek = (a: OpeningHour, b: OpeningHour) => {
    const daysOfWeekOrder = [
      "domingo",
      "segunda-feira",
      "terca-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sabado",
    ];

    return (
      daysOfWeekOrder.indexOf(a.dayOfWeek) -
      daysOfWeekOrder.indexOf(b.dayOfWeek)
    );
  };

  const sortedOpeningHours = establishment.openingHours.sort(compareDaysOfWeek);

  return (
    <div className="p-4">
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
        <p className="text-gray-400 font-bold uppercase">HORÁRIOS</p>
        {sortedOpeningHours.map(
          (item: OpeningHour, key: Key | null | undefined) => (
            <Sheet key={key}>
              <SheetTrigger
                onClick={() => {
                  setStartTime(item.startTime);
                  setEndTime(item.endTime);
                }}
                asChild
              >
                <div className="text-sm flex items-center justify-between px-2 py-2.5 my-2.5 last-of-type:mb-0 border rounded-lg">
                  <p className="capitalize text-gray-400">{item.dayOfWeek}</p>

                  <div className="flex">
                    {/* <p>
                  {item.startTime
                    ? `${item.startTime} - ${item.endTime}`
                    : "Fechado"}
                </p> */}

                    <Switch checked={item.startTime ? true : false} />
                    <div className="flex items-center pl-2">
                      <ArrowDown size={20} />
                    </div>
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent side="bottom">
                <div className="flex flex-col gap-2">
                  <p className="text-center text-sm font-bold">
                    Expediente de {item.dayOfWeek}
                  </p>
                  <div>
                    <label className="text-xs text-gray-400" htmlFor="startAt">
                      Inicia ás:
                    </label>
                    <Input
                      id="startAt"
                      name="startAt"
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400" htmlFor="endAt">
                      Termina ás:
                    </label>
                    <Input
                      id="endAt"
                      name="endAt"
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <SheetClose asChild>
                  <Button
                    onClick={() => submitClick(item.id, false)}
                    className="w-full mt-5"
                  >
                    Confirmar horário
                  </Button>
                </SheetClose>

                <div className="mt-10">
                  <p className="text-xs mb-2 text-gray-400">
                    Não tem expediente {item.dayOfWeek}?
                  </p>
                  <SheetClose asChild>
                    <Button
                      onClick={() => submitClick(item.id, true)}
                      className="w-full"
                    >
                      Não tenho expediente
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          )
        )}
      </div>
    </div>
  );
};

export default EstablishmentAdminInfo;
