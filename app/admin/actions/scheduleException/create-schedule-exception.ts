"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

type Props = {
  date: Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
  establishmentId: string;
  employeeId: string;
};

export const createScheduleException = async ({
  date,
  startTime,
  endTime,
  reason,
  establishmentId,
  employeeId,
}: Props) => {
  await db.scheduleException.create({
    data: {
      date,
      startTime,
      endTime,
      reason,
      establishmentId,
      employeeId,
    },
  });

  revalidatePath("/admin/employees");
};
