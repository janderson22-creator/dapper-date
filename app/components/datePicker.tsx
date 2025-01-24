import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  dontShowPast?: boolean;
};

export const DatePicker = ({ isOpen, setIsOpen, currentDate, setCurrentDate, dontShowPast }: Props) => {
  const dateClick = (date: Date | undefined) => {
    if (!date) return;

    setCurrentDate(date);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="w-full font-bold text-3x1 tracking-widest flex items-center">
          <p className="ml-auto">{format(currentDate, "dd/MM/yyyy")}</p>
          <ArrowDown size={18} className="ml-auto" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="p-0 lg:left-0 lg:right-0 lg:top-0 lg:bottom-0 lg:m-auto lg:w-4/12 lg:rounded-lg lg:h-fit"
        side="bottom"
      >
        <SheetHeader className="text-left px-5 py-2 border-b border-secondary">
          <SheetTitle>Selecione um dia</SheetTitle>
        </SheetHeader>

        {/* React Day Picker Below */}

        <div className="py-2 h-full">
          <Calendar
            className="w-full h-[50%]"
            mode="single"
            selected={currentDate}
            onSelect={dateClick}
            locale={ptBR}
            fromDate={(dontShowPast && new Date()) || undefined}
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
      </SheetContent>
    </Sheet>
  );
};
