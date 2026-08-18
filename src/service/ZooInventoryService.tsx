import "server-only";
import { prisma } from "@/lib/prisma";

export async function updateZooInventory(
  userId: number | string,
  specialCoatId: number | string,
  field: "count" | "level10" | "level20" | "glitterAnimal",
  value: number | boolean,
) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;
  const numericCoatId =
    typeof specialCoatId === "string" ? parseInt(specialCoatId, 10) : specialCoatId;

  if (isNaN(numericUserId) || isNaN(numericCoatId)) {
    throw new Error(`[ZooInventoryService] updateZooInventory aborted: Invalid ID provided.`);
  }

  return prisma.zooInventorySpecialCoat.upsert({
    where: {
      userid_specialCoatId: {
        userid: numericUserId,
        specialCoatId: numericCoatId,
      },
    },
    update: {
      [field]: field === "count" ? Number(value) : Boolean(value),
    },
    create: {
      userid: numericUserId,
      specialCoatId: numericCoatId,
      count: field === "count" ? Number(value) : 0,
      level10: field === "level10" ? Boolean(value) : false,
      level20: field === "level20" ? Boolean(value) : false,
      glitterAnimal: field === "glitterAnimal" ? Boolean(value) : false,
    },
  });
}
