import "server-only";
import prisma from "@/lib/prisma";

export async function getCountAnimals() {
  return prisma.animal.count();
}

export async function getCountSpecialCoats() {
  return prisma.specialCoat.count();
}

export async function getAllAnimals(locale: string = "de") {
  return prisma.animal.findMany({
    include: {
      animaltext: {
        where: { languageCode: locale },
      },
      animalxp: true,
      biome: {
        include: {
          biomestext: {
            where: { languageCode: locale },
          },
        },
      },
      priceType: true,
    },
    orderBy: { id: "asc" },
  });
}

export async function getAnimalById(
  id: number | string,
  locale: string | null = null,
): Promise<any | null> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    console.warn(`getAnimalById aborted: ID is not a number: ${id}`);
    return null;
  }

  // Prisma holt dank des 'where'-Filters direkt nur den Text in der gewünschten Sprache
  const animal = await prisma.animal.findUnique({
    where: { id: numericId },
    include: {
      animaltext: locale ? { where: { languageCode: locale } } : true,
      specialcoat: { include: { origin: true } },
      biome: {
        include: {
          biomestext: locale ? { where: { languageCode: locale } } : true,
        },
      },
      animalxp: { include: { xptype: true } },
      priceType: true,
      animalorigins: { include: { origin: true } },
      animalperenclosure: { orderBy: { numberAnimals: "asc" } },
    },
  });

  if (!animal) return null;

  return animal;
}
