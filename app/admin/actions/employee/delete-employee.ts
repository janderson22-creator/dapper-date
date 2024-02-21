"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface deleteEmployeeParams {
  employeeId: string;
}

export const deleteEmployee = async (params: deleteEmployeeParams) => {

  await db.employee.delete({
    where: {
      id: params.employeeId
    },
  });

  revalidatePath("/admin/employees");
};
