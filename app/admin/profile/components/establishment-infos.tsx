"use client";

import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Switch } from "@/app/components/ui/switch";
import { Establishment, OpeningHour } from "@prisma/client";
import { Smartphone } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateOpeningHours } from "../../actions/opening-hours/update-opening-hour";
import EditHourOpening from "./edit-hour-opening";
import { DAYS_OF_WEEK_ORDER } from "@/app/utils/daysOfWeek";
import { Slider } from "@/app/components/ui/slider";
import { updateEstablishment } from "../../actions/establishment-info/update-establishment";

interface Props {
  establishment: Establishment;
}

const EstablishmentAdminInfo: React.FC<Props> = ({ establishment }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pauseAt, setPauseAt] = useState("");
  const [backAt, setBackAt] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [openingHourId, setOpeningHourId] = useState("");
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [serviceDuration, setServiceDuration] = useState(
    establishment.serviceDuration
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sortedOpeningHours = useMemo(
    () =>
      [...establishment.openingHours].sort(
        (a, b) =>
          DAYS_OF_WEEK_ORDER.indexOf(a.dayOfWeek) -
          DAYS_OF_WEEK_ORDER.indexOf(b.dayOfWeek)
      ),
    [establishment.openingHours]
  );

  const disabledButton = useMemo(() => {
    if (!startTime || !endTime) return true;
    if (startTime > endTime) return true;
    if (pauseAt && backAt && pauseAt > backAt) return true;

    return false;
  }, [backAt, endTime, pauseAt, startTime]);

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(establishment.phoneNumber);

    toast.success("Copiado!", {
      duration: 6000,
      position: "top-center",
      description: "Cole onde desejar.",
    });
  };

  const editClick = useCallback((item: OpeningHour) => {
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setPauseAt(item.pauseAt);
    setBackAt(item.backAt);
    setDayOfWeek(item.dayOfWeek);
    setOpeningHourId(item.id);
    setOpenModalId(item.id);
  }, []);

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
          position: "bottom-center",
        });

        setOpenModalId(null);
      } catch (error) {
        console.error(error);
      }
    },
    [backAt, endTime, pauseAt, startTime]
  );

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateEstablishment({
        id: establishment.id,
        serviceDuration,
      });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 overflow-hidden">
      <p className="text-gray-400 font-bold uppercase">sobre nós</p>
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

        {sortedOpeningHours.map((item, key) => (
          <Sheet
            open={openModalId === item.id}
            onOpenChange={(isOpen) => setOpenModalId(isOpen ? item.id : null)}
            key={key}
          >
            <SheetTrigger onClick={() => editClick(item)} asChild>
              <div className="text-sm flex items-center justify-between px-2 py-2.5 my-2.5 last-of-type:mb-0 border rounded-lg cursor-pointer">
                <p className="capitalize text-gray-400">{item.dayOfWeek}</p>

                <Switch checked={item.startTime ? true : false} />
              </div>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="lg:bottom-0 lg:top-0 lg:left-0 lg:right-0 lg:h-fit lg:m-auto rounded-t-3xl lg:rounded-lg lg:w-4/12"
            >
              <div className="flex flex-col gap-2">
                <p className="text-center text-sm font-bold">
                  Expediente de {dayOfWeek}
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
                onClick={() => submitClick(openingHourId, false)}
                className="w-full mt-5"
              >
                Confirmar horário
              </Button>

              <div className="mt-10">
                <p className="text-xs mb-2 text-gray-400">
                  Não tem expediente {dayOfWeek}?
                </p>
                <SheetClose asChild>
                  <Button
                    onClick={() => submitClick(openingHourId, true)}
                    className="w-full"
                    variant="secondary"
                  >
                    Não tenho expediente
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>

      <div className="flex flex-col mb-10 relative">
        <p className="text-gray-400 font-bold uppercase">
          duração de um serviço
        </p>
        <div className="relative px-2 mb-10 mt-4">
          <Slider
            defaultValue={[serviceDuration]}
            onValueChange={(value) => setServiceDuration(value[0])}
            max={200}
            step={5}
            className="SliderRange"
          />
          <span
            className="absolute left-0 top-[30px] transform -translate-y-1/2 text-sm font-semibold whitespace-nowrap"
            style={{
              left: `${(serviceDuration / 200) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {serviceDuration} Min
          </span>
        </div>

        <div className="flex items-center">
          {/* <p className="text-gray-400 font-bold">
            Tempo atual ({establishment.serviceDuration} Minutos)
          </p> */}
          <Button
            onClick={() => handleUpdate()}
            disabled={serviceDuration === establishment.serviceDuration}
            className="w-fit ml-auto"
            variant="secondary"
          >
            {isLoading ? "Alterando..." : isSuccess ? "Alterado" : "Alterar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentAdminInfo;
