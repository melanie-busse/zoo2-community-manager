import "server-only";
import prisma from "@/lib/prisma";
import { PremiumVipType, type PremiumVipAnimalEntry, type Animal } from "@prisma/client";

export type PremiumVipAnimalEntryWithAnimal = PremiumVipAnimalEntry & {
  animal: Pick<Animal, "id" | "identifier"> | null;
};

export type BonusAnimalFormAnimal = { id: number; name: string; identifier: string | null };

export type BonusAnimalCreateInput = {
  type: PremiumVipType;
  year: number;
  dateLabel: string;
  startDate: string | null;
  endDate: string | null;
  animalName: string;
  animalId: number | null;
  isNpc: boolean;
};

export type BonusAnimalUpdateInput = BonusAnimalCreateInput;

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

export async function getEntryById(id: number): Promise<PremiumVipAnimalEntryWithAnimal | null> {
  const entry = await prisma.premiumVipAnimalEntry.findUnique({
    where: { id },
    include: { animal: { select: { id: true, identifier: true } } },
  });
  return entry as PremiumVipAnimalEntryWithAnimal | null;
}

export async function getAllAnimalsForBonusForm(
  locale: string,
): Promise<BonusAnimalFormAnimal[]> {
  const animals = await prisma.animal.findMany({
    include: { animaltext: { where: { languageCode: locale } } },
    orderBy: { id: "asc" },
  });
  return animals
    .map((a) => ({
      id: a.id,
      name: a.animaltext[0]?.animalName ?? "",
      identifier: a.identifier ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function createEntry(data: BonusAnimalCreateInput): Promise<{ id: number }> {
  const row = await prisma.premiumVipAnimalEntry.create({
    data: {
      type: data.type,
      year: data.year,
      dateLabel: data.dateLabel,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      animalName: data.animalName,
      animalId: data.animalId,
      isNpc: data.isNpc,
    },
  });
  return { id: row.id };
}

export async function updateEntry(
  id: number,
  data: BonusAnimalUpdateInput,
): Promise<{ id: number }> {
  const row = await prisma.premiumVipAnimalEntry.update({
    where: { id },
    data: {
      type: data.type,
      year: data.year,
      dateLabel: data.dateLabel,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      animalName: data.animalName,
      animalId: data.animalId,
      isNpc: data.isNpc,
    },
  });
  return { id: row.id };
}

export async function deleteEntry(id: number): Promise<void> {
  await prisma.premiumVipAnimalEntry.delete({ where: { id } });
}
