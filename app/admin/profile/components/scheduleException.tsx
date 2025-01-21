"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { times } from "../../utils/hoursOfDay";
import { Input } from "@/app/components/ui/input";
import { SelectOptions } from "@/app/components/select";

export const ScheduleException = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shiftOptionSelected, setShiftOptionSelected] =
    useState<ShiftOptions>("Dia todo");
  const [optionSelected, setOptionSelected] = useState<Options>("Turno");
  const [selectedInitialTime, setSelectedInitialTime] = useState<string>("");
  const [selectedFinalTime, setSelectedFinalTime] = useState<string>("");
  const [reason, setReason] = useState<string>();
  const shiftOptions = ["Dia todo", "Manha", "Tarde"];
  const options = ["Turno", "Horário"];

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="default"
          className="w-full font-bold text-3x1 mb-5 tracking-widest flex items-center"
        >
          <p className="ml-auto">Adicionar exceção/imprevisto em um dia</p>
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-t-lg w-full px-4" side="bottom">
        <p className="text-sm text-gray-400 py-2">
          Escolha a data em que não hávera expediente
        </p>
        <div className="py-2 h-full">
          <Calendar
            className="h-full px-0"
            mode="single"
            selected={currentDate}
            onSelect={(date) => date && setCurrentDate(date)}
            locale={ptBR}
            fromDate={new Date()}
            styles={{
              head_cell: {
                width: "100%",
                textTransform: "capitalize",
              },
              cell: {
                width: "100%",
              },
              button: {
                width: "100%",
              },
              nav_button_previous: {
                width: "32px",
                height: "32px",
              },
              nav_button_next: {
                width: "32px",
                height: "32px",
              },
              caption: {
                textTransform: "capitalize",
              },
            }}
          />
        </div>

        <p className="text-sm text-gray-400">Turno ou horário especifico?</p>

        <div className="mt-2 mb-4">
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

        {optionSelected === "Turno" && (
          <SelectOptions
            value={shiftOptionSelected}
            setValue={(value) => setShiftOptionSelected(value as ShiftOptions)}
            options={shiftOptions}
            placeHolder="Selecione um turno"
          />
        )}

        {optionSelected === "Horário" && (
          <div className="flex items-center justify-between gap-4">
            <SelectOptions
              value={selectedInitialTime}
              setValue={(value) => setSelectedInitialTime(value)}
              options={times}
              placeHolder="Horário inicial"
            />

            <SelectOptions
              value={selectedFinalTime}
              setValue={(value) => setSelectedFinalTime(value)}
              options={times}
              placeHolder="Horário final"
            />
          </div>
        )}

        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm text-gray-400" htmlFor="reason">
            Motivo:
          </label>
          <Input
            placeholder="ex: fiquei doente"
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <div className="mx-auto mt-4">
          <Button className="w-full">Adicionar exceção</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

type Options = "Turno" | "Horário";
type ShiftOptions = "Dia todo" | "Manha" | "Tarde";
