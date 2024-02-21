"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveEmployeeParams {
  imageUrl: string;
  name: string;
  position: string;
  establishmentId: string;
}

export const saveEmployee = async (params: SaveEmployeeParams) => {
  await db.employee.create({
    data: {
      imageUrl: params.imageUrl,
      name: params.name,
      position: params.position,
      establishmentId: params.establishmentId,
    },
  });

revalidatePath("/admin/employees");
};
