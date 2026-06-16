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
