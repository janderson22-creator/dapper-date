"use client";

import { Card, CardContent } from "./ui/card";
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { Booking } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { cancelBooking } from "../actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import sendWhatsAppMessage from "../e/[slug]/helpers/send-message-whatsapp";

interface BookingInfoProps {
  booking: Booking;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ booking }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [sheetConfirmIsOpen, setSheetConfirmIsOpen] = useState(false);
  const [bookingCanceled, setBookingCanceled] = useState(false);

  const cancelClick = async () => {
    setIsDeleteLoading(true);

    try {
      await cancelBooking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
      setBookingCanceled(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const sendMessage = () => {
    if (!booking) return;

    const message = `Óla, sou ${
      booking.user?.name
    }, estou cancelando a reserva para ${
      booking.employee?.name
    }, peço desculpas pois tive um imprevisto ${format(
      booking.date,
      "'no dia' dd 'de' MMMM 'ás' HH:mm",
      {
        locale: ptBR,
      }
    )}.`;
    const whatsappNumber = booking.establishment?.phoneNumber;
    sendWhatsAppMessage(whatsappNumber, message);

    setSheetConfirmIsOpen(false);
    setBookingCanceled(false);
  };

  return (
    <SheetContent className="w-11/12 px-0">
      <SheetHeader className="px-5 text-left pb-6 border-b border-secondary">
        <SheetTitle>Informações da reserva</SheetTitle>
      </SheetHeader>

      <div className="relative mt-6 px-3 rounded-lg">
        {/* TODO: add map with establishment location */}
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src="/map.png"
          alt={booking.establishment.name}
          className="h-[180px] w-full rounded-lg"
        />

        <div className="w-full absolute bottom-5 left-0 px-4">
          <Card>
            <CardContent className="p-4 flex gap-2">
              <Avatar>
                <AvatarImage src={booking.establishment.imageUrl} />
              </Avatar>

              <div>
                <h2 className="font-bold">{booking.establishment.name}</h2>
                <h3 className="text-gray-400 text-xs overflow-hidden text-nowrap text-ellipsis">
                  {booking.establishment.address}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-3">
        <Badge
          className={cn(
            "bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit my-4",
            isPast(booking.date) && "bg-secondary text-foreground opacity-70"
          )}
        >
          {isPast(booking.date) ? "Finalizado" : "Confirmado"}
        </Badge>

        <Card>
          <CardContent className="p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{booking.service.name}</h2>
              <h3 className="font-bold text-sm">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(booking.service.price))}
              </h3>
            </div>

            <div className="flex justify-between text-sm">
              <h3 className="text-gray-400">Data</h3>
              <h4 className="text-gray-400">
                {format(booking.date, "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </h4>
            </div>

            <div className="flex justify-between text-sm">
              <h3 className="text-gray-400">Horário</h3>
              <h4 className="text-gray-400">{format(booking.date, "HH:mm")}</h4>
            </div>

            <div className="flex justify-between text-sm">
              <h3 className="text-gray-400">Estabelecimento</h3>
              <h4 className="text-gray-400">{booking.establishment.name}</h4>
            </div>

            <div className="flex justify-between text-sm">
              <h3 className="text-gray-400">Profissional</h3>
              <h4 className="text-gray-400">{booking.employee.name}</h4>
            </div>
          </CardContent>
        </Card>

        <SheetFooter className="flex-row items-center gap-3 mt-6">
          <SheetClose asChild>
            <Button className="w-full" variant="secondary">
              Voltar
            </Button>
          </SheetClose>

          <AlertDialog
            open={sheetConfirmIsOpen}
            onOpenChange={setSheetConfirmIsOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                disabled={
                  isPast(booking.date) || isDeleteLoading || bookingCanceled
                }
                className="w-full"
                variant="destructive"
              >
                {bookingCanceled
                  ? "Reserva cancelada com sucesso!"
                  : "Cancelar Reserva"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[90%] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja cancelar esse agendamento?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3">
                <AlertDialogCancel className="w-full mt-0">
                  Voltar
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={
                    isPast(booking.date) || isDeleteLoading || bookingCanceled
                  }
                  className="w-full"
                  onClick={cancelClick}
                >
                  {isDeleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
        
        {bookingCanceled && (
          <SheetClose asChild>
            <Button
              className="w-full mt-3 bg-green-500 border-none"
              onClick={() => sendMessage()}
            >
              Confirmar via whatsapp
            </Button>
          </SheetClose>
        )}
      </div>
    </SheetContent>
  );
};

export default BookingInfo;
