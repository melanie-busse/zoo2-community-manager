import "server-only";
import { prisma } from "@/lib/prisma";

export async function getZooInventoryForUser(userId: number | string) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;

  if (isNaN(numericUserId)) {
    return [];
  }

  return prisma.zooInventorySpecialCoat.findMany({
    where: { userid: numericUserId },
  });
}

export async function updateZooInventory(
  userId: number | string,
  specialCoatId: number | string,
  field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
  value: number | boolean | null,
) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;
  const numericCoatId =
    typeof specialCoatId === "string" ? parseInt(specialCoatId, 10) : specialCoatId;

  if (isNaN(numericUserId) || isNaN(numericCoatId)) {
    throw new Error(`[ZooInventoryService] updateZooInventory aborted: Invalid ID provided.`);
  }

  const parsedValue =
    field === "regionId"
      ? value === null ? null : Number(value)
      : field === "count"
        ? Number(value)
        : Boolean(value);

  return prisma.zooInventorySpecialCoat.upsert({
    where: {
      userid_specialCoatId: {
        userid: numericUserId,
        specialCoatId: numericCoatId,
      },
    },
    update: { [field]: parsedValue },
    create: {
      userid: numericUserId,
      specialCoatId: numericCoatId,
      count: field === "count" ? Number(value) : 0,
      level10: field === "level10" ? Boolean(value) : false,
      level20: field === "level20" ? Boolean(value) : false,
      glitterAnimal: field === "glitterAnimal" ? Boolean(value) : false,
      regionId: field === "regionId" ? (value === null ? null : Number(value)) : null,
    },
  });
}

export async function getZooInventoryAnimalsForUser(userId: number | string) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;

  if (isNaN(numericUserId)) {
    return [];
  }

  return prisma.zooInventoryAnimal.findMany({
    where: { userid: numericUserId },
  });
}

export async function updateZooInventoryAnimal(
  userId: number | string,
  animalId: number | string,
  field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
  value: number | boolean | null,
) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;
  const numericAnimalId = typeof animalId === "string" ? parseInt(animalId, 10) : animalId;

  if (isNaN(numericUserId) || isNaN(numericAnimalId)) {
    throw new Error(`[ZooInventoryService] updateZooInventoryAnimal aborted: Invalid ID provided.`);
  }

  const parsedValue =
    field === "regionId"
      ? value === null
        ? null
        : Number(value)
      : field === "count"
        ? Number(value)
        : Boolean(value);

  return prisma.zooInventoryAnimal.upsert({
    where: {
      userid_animalId: {
        userid: numericUserId,
        animalId: numericAnimalId,
      },
    },
    update: { [field]: parsedValue },
    create: {
      userid: numericUserId,
      animalId: numericAnimalId,
      count: field === "count" ? Number(value) : 0,
      level10: field === "level10" ? Boolean(value) : false,
      level20: field === "level20" ? Boolean(value) : false,
      glitterAnimal: field === "glitterAnimal" ? Boolean(value) : false,
      regionId: field === "regionId" ? (value === null ? null : Number(value)) : null,
    },
  });
}

export async function getZooInventoryStatuesForUser(userId: number | string) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;

  if (isNaN(numericUserId)) {
    return [];
  }

  return prisma.zooInventoryStatue.findMany({
    where: { userid: numericUserId },
  });
}

export async function updateZooInventoryStatue(
  userId: number | string,
  animalId: number | string,
  field: "puzzlePieces" | "regionId",
  value: number | null,
) {
  const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;
  const numericAnimalId = typeof animalId === "string" ? parseInt(animalId, 10) : animalId;

  if (isNaN(numericUserId) || isNaN(numericAnimalId)) {
    throw new Error(`[ZooInventoryService] updateZooInventoryStatue aborted: Invalid ID provided.`);
  }

  const parsedValue = value === null ? null : Number(value);

  return prisma.zooInventoryStatue.upsert({
    where: {
      userid_animalId: {
        userid: numericUserId,
        animalId: numericAnimalId,
      },
    },
    update: { [field]: parsedValue },
    create: {
      userid: numericUserId,
      animalId: numericAnimalId,
      puzzlePieces: field === "puzzlePieces" ? parsedValue : null,
      regionId: field === "regionId" ? parsedValue : null,
    },
  });
}
