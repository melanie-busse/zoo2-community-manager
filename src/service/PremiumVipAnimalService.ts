import "server-only";
import prisma from "@/lib/prisma";
import { PremiumVipType, type PremiumVipAnimalEntry, type Animal } from "@prisma/client";

export type PremiumVipAnimalEntryWithAnimal = PremiumVipAnimalEntry & {
  animal: Pick<Animal, "id" | "identifier"> | null;
};

export async function getPremiumVipAnimals(
  type: PremiumVipType,
  options: {
    animalName?: string;
    year?: number;
    page: number;
    pageSize: number;
  }
): Promise<{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number }> {
  const { animalName, year, page, pageSize } = options;

  const where: Record<string, unknown> = { type };
  if (animalName) {
    where.animalName = { contains: animalName, mode: "insensitive" };
  }
  if (year !== undefined) {
    where.year = year;
  }

  const skip = (page - 1) * pageSize;

  const [entries, total] = await Promise.all([
    prisma.premiumVipAnimalEntry.findMany({
      where,
      orderBy: [{ year: "desc" }, { startDate: "desc" }],
      include: { animal: { select: { id: true, identifier: true } } },
      skip,
      take: pageSize,
    }),
    prisma.premiumVipAnimalEntry.count({ where }),
  ]);

  return { entries: entries as PremiumVipAnimalEntryWithAnimal[], total };
}

export async function getAvailableYears(type: PremiumVipType): Promise<number[]> {
  const rows = await prisma.premiumVipAnimalEntry.groupBy({
    by: ["year"],
    where: { type },
    orderBy: { year: "desc" },
  });
  return rows.map((r) => r.year);
}
