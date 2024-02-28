"use server";

import { db } from "../../../lib/prisma";

export const getEmployees = async (establishmentId: string) => {
  const employees = await db.employee.findMany({
    where: {
      establishmentId,
    },
  });

  return employees;
};
