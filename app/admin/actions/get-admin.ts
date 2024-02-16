"use server";

import { db } from "../../lib/prisma";

export const getAdmin = async (email: string, password: string) => {
  const admin = await db.admin.findUnique({
    where: {
      email: email,
      password: password
    },
  });

  return admin
};
