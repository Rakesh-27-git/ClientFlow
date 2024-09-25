import { db } from "@/prisma/db";
import { UserRole } from "@prisma/client";

export async function getAllClients() {
  try {
    const clients = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "CLIENT" as UserRole,
      },
    });
    return clients;
  } catch (error) {
    console.log(error);
    return null;
  }
}
