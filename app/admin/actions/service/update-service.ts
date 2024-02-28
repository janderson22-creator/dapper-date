"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateServiceParams {
  serviceId: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}

export const updateService = async (params: UpdateServiceParams) => {
  await db.service.update({
    where: {
      id: params.serviceId,
    },
    data: {
      imageUrl: params.imageUrl,
      name: params.name,
      description: params.description,
      price: params.price,
    },
  });

  revalidatePath("/admin/services");
};
