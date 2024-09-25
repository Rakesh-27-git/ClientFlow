import { db } from "@/prisma/db";
import { UserRole } from "@prisma/client";

export async function getUserClients(userId: string | undefined) {
  if (userId) {
    try {
      const clients = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: "CLIENT" as UserRole,
          userId,
        },
      });
      return clients;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
