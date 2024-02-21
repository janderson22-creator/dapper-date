"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateEmployeeParams {
  employeeId: string;
  imageUrl?: string;
  name?: string;
  position?: string;
  establishmentId: string;
}

export const updateEmployee = async (params: UpdateEmployeeParams) => {
  await db.employee.update({
    where: {
      id: params.employeeId,
    },
    data: {
      imageUrl: params.imageUrl,
      name: params.name,
      position: params.position,
      establishmentId: params.establishmentId,
    },
  });

  revalidatePath("/admin/employees");
};
