"use client";

import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";
import { times } from "../../utils/hoursOfDay";
import { Input } from "@/app/components/ui/input";
import { SelectOptions } from "@/app/components/select";
import { DatePicker } from "@/app/components/datePicker";
import { Booking, Employee, Establishment, OpeningHour } from "@prisma/client";
import { getBookingsByEmployee } from "../../actions/booking/get-bookings-by-employee";
import { DAYS_OF_WEEK_ORDER } from "@/app/utils/daysOfWeek";

type Props = {
  establishment: Establishment;
};

export const ScheduleException = ({ establishment }: Props) => {
  const employees: Employee[] = establishment.employees;
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shiftOptionSelected, setShiftOptionSelected] =
    useState<ShiftOptions>("Dia todo");
  const [optionSelected, setOptionSelected] = useState<Options>("Turno");
  const [selectedInitialTime, setSelectedInitialTime] = useState<string>("");
  const [selectedFinalTime, setSelectedFinalTime] = useState<string>("");
  const [reason, setReason] = useState<string>();
  const [employeesSelected, setEmployeesSelected] = useState<string[]>([]);

  const shiftOptions = ["Dia todo", "Manha", "Tarde"];
  const options = ["Turno", "Horário"];

  const toggleEmployeeSelection = (employeeId: string) => {
    setEmployeesSelected((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const submitClick = () => {
    const dayOfWeek = DAYS_OF_WEEK_ORDER[currentDate.getDay()];

    // Encontrar o horário de funcionamento do estabelecimento para o dia selecionado
    const openingHourBySelectedDay = establishment.openingHours.find(
      (oh: OpeningHour) => oh.dayOfWeek === dayOfWeek
    );

    if (!openingHourBySelectedDay) {
      console.error(
        "Horário de funcionamento não encontrado para o dia selecionado."
      );
      return;
    }

    // Parse dos horários do OpeningHour
    const { startTime, endTime, pauseAt, backAt } = openingHourBySelectedDay;

    // Função para converter strings de horário ("HH:mm") em objetos Date
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date(currentDate);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    // Inicializar as variáveis com valores padrão
    let startOfShift: Date = parseTime(startTime); // Padrão: início do dia
    let endOfShift: Date = parseTime(endTime); // Padrão: fim do dia

    // Lógica para definir os horários com base no turno
    if (shiftOptionSelected === "Manha") {
      // Manhã: do horário de abertura até o início da pausa
      endOfShift = pauseAt ? parseTime(pauseAt) : parseTime(endTime); // Usa pausa, se disponível
    } else if (shiftOptionSelected === "Tarde") {
      // Tarde: do retorno da pausa até o horário de fechamento
      startOfShift = backAt ? parseTime(backAt) : parseTime(startTime); // Usa retorno, se disponível
    }

    console.log("SHIFT OPTION SELECTED", shiftOptionSelected);
    console.log("START OF SHIFT", startOfShift);
    console.log("END OF SHIFT", endOfShift);

    // Chamar a função de backend com os horários calculados
    getBookingsByEmployee({
      establishmentId: establishment.id,
      employeesId: employeesSelected,
      initialDate: startOfShift, // Passe apenas o início do turno ou ajuste o backend para intervalos
      endDate: endOfShift,
    })
      .then((r) => console.log(r))
      .catch((error) => console.error("Error fetching bookings:", error));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="w-full font-bold text-3x1 mb-5 tracking-widest flex items-center"
        >
          Adicionar exceção/imprevisto em um dia
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-t-lg w-full px-4" side="bottom">
        <div className="py-4 h-full">
          <DatePicker
            isOpen={sheetIsOpen}
            setIsOpen={setSheetIsOpen}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>

        <p className="text-sm text-gray-400">
          Selecione um ou mais funcionários:
        </p>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant={
                employeesSelected.includes(employee.id)
                  ? "default"
                  : "secondary"
              }
              onClick={() => toggleEmployeeSelection(employee.id)}
              className="capitalize"
            >
              {employee.name}
            </Button>
          ))}
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
          />
        </div>

        <div className="mx-auto mt-4">
          <Button onClick={submitClick} type="submit" className="w-full">
            Adicionar exceção
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

type Options = "Turno" | "Horário";
type ShiftOptions = "Dia todo" | "Manha" | "Tarde";
