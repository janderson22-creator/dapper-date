import BookingInfo from "@/app/components/booking-info";
import { AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Sheet, SheetTrigger } from "@/app/components/ui/sheet";
import { cn } from "@/app/utils/cn";
import { Booking } from "@prisma/client";
import { Avatar } from "@radix-ui/react-avatar";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";

interface BookingAdminItemProps {
  booking: Booking;
}

const BookingAdminItem: React.FC<BookingAdminItemProps> = ({ booking }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Card className="min-w-[90%]">
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
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={booking.user.image}
                    className="object-cover rounded-full"
                  />

                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-semibold opacity-90">
                    {booking.user.name}
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

export default BookingAdminItem;
