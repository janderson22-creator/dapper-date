"use client";

import { Button } from "@/app/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { useCallback, useMemo, useState } from "react";
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
import { createScheduleException } from "../../actions/scheduleException/create-schedule-exception";
import { format } from "date-fns";
import { toast } from "sonner";

type Props = {
  establishment: Establishment;
};

type Options = "Turno" | "Horário";
type ShiftOptions = "Dia todo" | "Manha" | "Tarde";

export const ScheduleException = ({ establishment }: Props) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shiftOptionSelected, setShiftOptionSelected] = useState<ShiftOptions>("Dia todo");
  const [optionSelected, setOptionSelected] = useState<Options>("Turno");
  const [selectedInitialTime, setSelectedInitialTime] = useState<string>("");
  const [selectedFinalTime, setSelectedFinalTime] = useState<string>("");
  const [reason, setReason] = useState<string>();
  const [employeesSelected, setEmployeesSelected] = useState<string[]>([]);
  const [bookingsToSendMessage, setBookingsToSendMessage] = useState<Booking[]>();
  const [startOfShift, setStartOfShift] = useState<Date>();
  const [endOfShift, setEndOfShift] = useState<Date>();

  const shiftOptions = ["Dia todo", "Manha", "Tarde"];
  const options = ["Turno", "Horário"];
  const employees: Employee[] = establishment.employees;

  const disableSubmit = useMemo(() => {
    if (!employeesSelected.length || !reason) return true;

    if (optionSelected === "Horário" && !selectedInitialTime && !selectedFinalTime) return true;

    return false;
  }, [employeesSelected.length, optionSelected, reason, selectedFinalTime, selectedInitialTime]);

  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setEmployeesSelected((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]
    );
  }, []);

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(currentDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const submitClick = () => {
    const dayOfWeek = DAYS_OF_WEEK_ORDER[currentDate.getDay()];
    const openingHour = establishment.openingHours.find((oh: OpeningHour) => oh.dayOfWeek === dayOfWeek);

    if (!openingHour) {
      console.error("Horário de funcionamento não encontrado para o dia selecionado.");
      return;
    }

    const { startTime, endTime, pauseAt, backAt } = openingHour;

    let start: Date = parseTime(startTime);
    let end: Date = parseTime(endTime);

    if (optionSelected === "Turno") {
      if (shiftOptionSelected === "Manha") end = pauseAt ? parseTime(pauseAt) : parseTime(endTime);
      if (shiftOptionSelected === "Tarde") start = backAt ? parseTime(backAt) : parseTime(startTime);
    } else {
      start = parseTime(selectedInitialTime);
      end = parseTime(selectedFinalTime);
    }

    getBookingsByEmployee({
      establishmentId: establishment.id,
      employeesId: employeesSelected,
      initialDate: start,
      endDate: end,
    })
      .then((bookings) => {
        setBookingsToSendMessage(bookings), setStartOfShift(start), setEndOfShift(end);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  };

  const createShiftOff = useCallback(async () => {
    if (!startOfShift || !endOfShift) return;

    try {
      await Promise.all(
        employeesSelected.map((employeeId) =>
          createScheduleException({
            date: currentDate,
            startTime: format(startOfShift, "HH:mm"),
            endTime: format(endOfShift, "HH:mm"),
            reason,
            establishmentId: establishment.id,
            employeeId,
          })
        )
      );

      toast.success("Exceções criadas com sucesso!", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Erro ao criar exceções:", error);
    }
  }, [startOfShift, endOfShift, reason, employeesSelected, establishment.id, currentDate]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="w-full font-bold text-3x1 mb-5 tracking-widest flex items-center">
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
            dontShowPast
          />
        </div>

        <p className="text-sm text-gray-400">Selecione um ou mais funcionários:</p>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant={employeesSelected.includes(employee.id) ? "default" : "secondary"}
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
            <Button disabled={disableSubmit} onClick={submitClick} className="w-full">
              Adicionar exceção
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90%] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Adicionar exceção de trabalho?</AlertDialogTitle>
              <AlertDialogDescription>
                {bookingsToSendMessage?.length
                  ? "Existem agendamentos para esse horário selecionado, tem certeza que deseja adicionar essa exceção? os agendamentos serão cancelados e os usuarios serão notificados pelo whatsapp."
                  : "Tem certeza que deseja adicionar essa exceção? nenhum cliente será impactado pois não existe nenhum agendamento para o horário selecionado."}
                <Card className="my-4">
                  <CardContent className=" h-fit py-2 font-bold text-sm flex flex-col gap-2">
                    <p>Data: {`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}</p>
                    <p>
                      Horário de início:{" "}
                      {`${startOfShift?.getHours()}:${startOfShift?.getMinutes().toString().padStart(2, "0")}`}
                    </p>
                    <p>
                      Horário de término:{" "}
                      {`${endOfShift?.getHours()}:${endOfShift?.getMinutes().toString().padStart(2, "0")}`}
                    </p>
                    <p>Motivo: {reason || "Não especificado"}</p>
                  </CardContent>
                </Card>
                <span>
                  ATENÇÃO: Ao adicionar uma exceção, seus clientes não poderão marcar horarios nesse periodo de tempo
                  escolhido acima.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-3">
              <AlertDialogCancel
                onClick={() => {
                  setStartOfShift(undefined);
                  setEndOfShift(undefined);
                }}
                className="w-full mt-0"
              >
                Voltar
              </AlertDialogCancel>

              <SheetClose asChild>
                <AlertDialogAction className="w-full" onClick={createShiftOff}>
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
