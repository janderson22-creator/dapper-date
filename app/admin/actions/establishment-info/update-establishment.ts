"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateEstablishmentParams {
  id: string;
  imageUrl?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  averageTimeService?: number;
}

export const updateEstablishment = async (
  params: UpdateEstablishmentParams
) => {
  await db.establishment.update({
    where: {
      id: params.id,
    },
    data: {
      imageUrl: params.imageUrl,
      name: params.name,
      phoneNumber: params.phoneNumber,
      address: params.address,
      description: params.description,
      averageTimeService: params.averageTimeService,
    },
  });

  revalidatePath("/admin/profile");
};
