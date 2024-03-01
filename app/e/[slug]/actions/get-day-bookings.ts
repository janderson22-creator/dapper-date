"use server"

import { db } from "@/app/lib/prisma"
import { endOfDay, startOfDay } from "date-fns"

export const getDayBookings = async (date: Date, establishmentId: string, employeeId: string) => {
    const bookings = await db.booking.findMany({
        where: {
            employeeId,
            establishmentId,
            date: {
                // menor que o final do dia
                lte: endOfDay(date), 
                // maior que o final do dia
                gte: startOfDay(date)
            }
        }
    })

    return bookings
}