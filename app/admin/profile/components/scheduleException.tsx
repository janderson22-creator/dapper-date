"use client";

import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { useState } from "react";
import { times } from "../../utils/hoursOfDay";
import { Input } from "@/app/components/ui/input";
import { SelectOptions } from "@/app/components/select";
import { DatePicker } from "@/app/components/datePicker";
import { Booking, Employee, Establishment, OpeningHour } from "@prisma/client";
import { DAYS_OF_WEEK_ORDER } from "@/app/utils/daysOfWeek";
import { getBookingsByEmployee } from "../../actions/booking/get-bookings-by-employee-id";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Card, CardContent } from "@/app/components/ui/card";

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
  const [bookingsToSendMessage, setBookingsToSendMessage] =
    useState<Booking[]>();
  const [startOfShift, setStartOfShift] = useState<Date>();
  const [endOfShift, setEndOfShift] = useState<Date>();

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

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(currentDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const submitClick = () => {
    const dayOfWeek = DAYS_OF_WEEK_ORDER[currentDate.getDay()];
    const openingHourBySelectedDay = establishment.openingHours.find(
      (oh: OpeningHour) => oh.dayOfWeek === dayOfWeek
    );

    if (!openingHourBySelectedDay) {
      console.error(
        "Horário de funcionamento não encontrado para o dia selecionado."
      );
      return;
    }

    const { startTime, endTime, pauseAt, backAt } = openingHourBySelectedDay;

    let startOfShift: Date = parseTime(startTime);
    let endOfShift: Date = parseTime(endTime);

    if (optionSelected === "Turno") {
      if (shiftOptionSelected === "Manha") {
        endOfShift = pauseAt ? parseTime(pauseAt) : parseTime(endTime);
      } else if (shiftOptionSelected === "Tarde") {
        startOfShift = backAt ? parseTime(backAt) : parseTime(startTime);
      }
    } else {
      startOfShift = parseTime(selectedInitialTime);
      endOfShift = parseTime(selectedFinalTime);
    }

    getBookingsByEmployee({
      establishmentId: establishment.id,
      employeesId: employeesSelected,
      initialDate: startOfShift,
      endDate: endOfShift,
    })
      .then((r) => {
        setBookingsToSendMessage(r),
          setStartOfShift(startOfShift),
          setEndOfShift(endOfShift);
      })
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

        <AlertDialog>
          <AlertDialogTrigger className="mx-auto mt-4" asChild>
            <Button onClick={submitClick} className="w-full">
              Adicionar exceção
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90%] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Adicionar exceção em um dia de trabalho
              </AlertDialogTitle>
              <AlertDialogDescription>
                {bookingsToSendMessage?.length
                  ? "Existem agendamentos para esse horário selecionado, tem certeza que deseja adicionar essa exceção? os agendamentos serão cancelados e os usuarios serão notificados pelo whatsapp."
                  : "Tem certeza que deseja adicionar essa exceção, nenhum cliente será impactado pois não existe nenhum agendamento para o horário selecionado."}
                <Card>
                  <CardContent className="">
                    <div>
                      <p>dia: {currentDate.getDate()}</p>
                      {startOfShift && endOfShift && (
                        <>
                          <p>inicia: {startOfShift.getHours()}</p>
                          <p>termin: {endOfShift.getHours()}</p>
                        </>
                      )}
                      <p>motivo: {reason}</p>
                    </div>
                  </CardContent>
                </Card>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3">
              <AlertDialogCancel className="w-full mt-0">
                Voltar
              </AlertDialogCancel>

              <SheetClose asChild>
                <AlertDialogAction className="w-full" onClick={() => {}}>
                  Confirmar
                </AlertDialogAction>
              </SheetClose>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
};

type Options = "Turno" | "Horário";
type ShiftOptions = "Dia todo" | "Manha" | "Tarde";
