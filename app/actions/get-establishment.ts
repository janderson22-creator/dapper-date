"use server";

import { getServerSession } from "next-auth";
import { db } from "../lib/prisma";
import { authOptions } from "../lib/auth";

export const getEstablishment = async (slug: string) => {
  const session = await getServerSession(authOptions);
  const establishment = await db.establishment.findUnique({
    where: {
      slug,
    },
    include: {
      services: true,
      openingHours: true,
      employees: true,
    },
  });

  return {
    establishment,
    session,
  };
};
