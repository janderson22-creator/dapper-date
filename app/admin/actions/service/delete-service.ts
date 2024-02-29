"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface deleteServiceParams {
  serviceId: string;
}

export const deleteService = async (params: deleteServiceParams) => {

  const response = await db.service.delete({
    where: {
      id: params.serviceId,
    },
  });

  revalidatePath("/admin/services");
  return response;
};
