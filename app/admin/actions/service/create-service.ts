"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveServiceParams {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  establishmentId: string;
}

export const saveService = async (params: SaveServiceParams) => {
  await db.service.create({
    data: {
      imageUrl: params.imageUrl,
      name: params.name,
      description: params.description,
      price: params.price,
      establishmentId: params.establishmentId,
    },
  });

  revalidatePath("/admin/services");
};
