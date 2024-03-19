"use client";

import { Booking } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "../lib/utils";
import {
  Sheet,
  SheetTrigger,
} from "./ui/sheet";
import BookingInfo from "./booking-info";

interface BookingItemProps {
  booking: Booking;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-[90%] lg:min-w-[30%] cursor-pointer">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className={cn(
                  "bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit",
                  isPast(booking.date) &&
                    "bg-secondary text-foreground opacity-70"
                )}
              >
                {isPast(booking.date) ? "Finalizado" : "Confirmado"}
              </Badge>
              <h2 className="font-bold">{booking?.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={booking.establishment.imageUrl}
                    className="object-cover"
                  />

                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-semibold opacity-90">
                    {booking.establishment.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {booking.employee?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-secondary px-3">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <BookingInfo booking={booking} />
    </Sheet>
  );
};

export default BookingItem;
