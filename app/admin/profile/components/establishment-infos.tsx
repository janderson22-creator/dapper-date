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
import { Key, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateOpeningHours } from "../../actions/opening-hours/update-opening-hour";
import EditHourOpening from "./edit-hour-opening";

interface Props {
  establishment: Establishment;
}

const EstablishmentAdminInfo: React.FC<Props> = ({ establishment }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pauseAt, setPauseAt] = useState("");
  const [backAt, setBackAt] = useState("");
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

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
      if (startTime && !endTime) {
        return toast.error("Horário final do expediente não preenchido");
      }

      if (startTime && endTime && pauseAt && !backAt) {
        return toast.error("Horário de retorno do intervalo não preenchido");
      }

      if (startTime > endTime) {
        return toast.error("Horário final antes do inicial");
      }

      if (pauseAt > backAt) {
        return toast.error("Horário final de intervalo antes do inicial");
      }

      try {
        await updateOpeningHours({
          id,
          startTime: dayOff ? "" : startTime,
          endTime: dayOff ? "" : endTime,
          pauseAt: dayOff ? "" : pauseAt,
          backAt: dayOff ? "" : backAt,
        });

        toast.success("Horário alterado com sucesso!", {
          duration: 4000,
          position: "top-center",
        });

        setSheetIsOpen(false);
      } catch (error) {
        console.error(error);
      }
    },
    [backAt, endTime, pauseAt, startTime]
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

  const disabledButton = useMemo(() => {
    if (!startTime || !endTime || !pauseAt || !backAt) return true;

    return false;
  }, [backAt, endTime, pauseAt, startTime]);

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
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen} key={key}>
              <SheetTrigger
                onClick={() => {
                  setStartTime(item.startTime);
                  setEndTime(item.endTime);
                  setPauseAt(item.pauseAt);
                  setBackAt(item.backAt);
                }}
                asChild
              >
                <div className="text-sm flex items-center justify-between px-2 py-2.5 my-2.5 last-of-type:mb-0 border rounded-lg cursor-pointer">
                  <p className="capitalize text-gray-400">{item.dayOfWeek}</p>

                  <div className="flex">
                    <Switch checked={item.startTime ? true : false} />
                    <div className="flex items-center pl-2">
                      <ArrowDown size={20} />
                    </div>
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="lg:bottom-0 lg:top-0 lg:left-0 lg:right-0 lg:h-fit lg:m-auto lg:rounded-lg lg:w-4/12"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-center text-sm font-bold">
                    Expediente de {item.dayOfWeek}
                  </p>

                  <div className="flex items-center gap-4">
                    <EditHourOpening
                      label="Inicia"
                      value={startTime}
                      setValue={setStartTime}
                    />

                    <EditHourOpening
                      startTime={startTime}
                      label="Termina"
                      value={endTime}
                      setValue={setEndTime}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <EditHourOpening
                      startTime={startTime}
                      endTime={endTime}
                      label="Pausa"
                      value={pauseAt}
                      setValue={setPauseAt}
                    />

                    <EditHourOpening
                      pauseAt={pauseAt}
                      endTime={endTime}
                      label="Volta"
                      value={backAt}
                      setValue={setBackAt}
                    />
                  </div>
                </div>

                <Button
                  disabled={disabledButton}
                  onClick={() => submitClick(item.id, false)}
                  className="w-full mt-5"
                >
                  Confirmar horário
                </Button>

                <div className="mt-10">
                  <p className="text-xs mb-2 text-gray-400">
                    Não tem expediente {item.dayOfWeek}?
                  </p>
                  <SheetClose asChild>
                    <Button
                      onClick={() => submitClick(item.id, true)}
                      className="w-full"
                      variant="secondary"
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
