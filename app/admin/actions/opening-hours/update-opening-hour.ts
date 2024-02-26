"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateHourParams {
  id: string;
  startTime: string;
  endTime: string;
  pauseAt: string;
  backAt: string;
}

export const updateOpeningHours = async (params: UpdateHourParams) => {
  await db.openingHour.update({
    where: {
      id: params.id,
    },
    data: {
      startTime: params.startTime,
      endTime: params.endTime,
      pauseAt: params.pauseAt,
      backAt: params.backAt,
    },
  });

  revalidatePath("/admin/profile");
};
