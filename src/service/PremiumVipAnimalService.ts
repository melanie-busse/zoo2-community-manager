import "server-only";
import prisma from "@/lib/prisma";
import { PremiumVipType, type PremiumVipAnimalEntry } from "@prisma/client";

export type PremiumVipAnimalEntryWithAnimal = PremiumVipAnimalEntry & {
  animal: {
    id: number;
    identifier: string | null;
    localeName: string;
    biome: {
      identifier: string;
      localeName: string;
    } | null;
  } | null;
};

export type BonusAnimalFormAnimal = { id: number; name: string; identifier: string | null };

export type BonusAnimalCreateInput = {
  type: PremiumVipType;
  identifier: string;
  startDate: string | null;
  endDate: string | null;
  animalId: number | null;
  isNpc: boolean;
};

export type BonusAnimalUpdateInput = BonusAnimalCreateInput;

function animalInclude(locale: string) {
  return {
    animal: {
      select: {
        id: true,
        identifier: true,
        animaltext: { where: { languageCode: locale } },
        biome: {
          select: {
            identifier: true,
            biomestext: { where: { languageCode: locale } },
          },
        },
      },
    },
  };
}

function mapToEntry(raw: any, locale: string): PremiumVipAnimalEntryWithAnimal {
  if (!raw.animal) return { ...raw, animal: null };
  const animalText =
    raw.animal.animaltext.find((t: any) => t.languageCode === locale) ??
    raw.animal.animaltext[0];
  const biomeText =
    raw.animal.biome?.biomestext?.find((t: any) => t.languageCode === locale) ??
    raw.animal.biome?.biomestext?.[0];
  return {
    ...raw,
    animal: {
      id: raw.animal.id,
      identifier: raw.animal.identifier,
      localeName: animalText?.animalName ?? "",
      biome: raw.animal.biome
        ? {
            identifier: raw.animal.biome.identifier,
            localeName: biomeText?.biomeName ?? "",
          }
        : null,
    },
  };
}

export async function getPremiumVipAnimals(
  type: PremiumVipType,
  options: {
    animalName?: string;
    year?: number;
    page: number;
    pageSize: number;
  },
  locale = "de",
): Promise<{ entries: PremiumVipAnimalEntryWithAnimal[]; total: number }> {
  const { animalName, year, page, pageSize } = options;

  const where: Record<string, unknown> = { type };
  if (animalName) {
    where.identifier = { contains: animalName };
  }
  if (year !== undefined) {
    where.startDate = {
      gte: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
      lt: new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0)),
    };
  }

  const skip = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    prisma.premiumVipAnimalEntry.findMany({
      where,
      orderBy: [{ startDate: "desc" }, { id: "desc" }],
      include: animalInclude(locale),
      skip,
      take: pageSize,
    }),
    prisma.premiumVipAnimalEntry.count({ where }),
  ]);

  return { entries: rows.map((r) => mapToEntry(r, locale)), total };
}

export async function getAvailableYears(type: PremiumVipType): Promise<number[]> {
  const rows = await prisma.premiumVipAnimalEntry.findMany({
    where: {
      type,
      startDate: { not: null },
    },
    select: { startDate: true },
    distinct: ["startDate"],
  });

  const years = new Set<number>();
  for (const row of rows) {
    if (row.startDate) {
      years.add(row.startDate.getUTCFullYear());
    }
  }

  return Array.from(years).sort((a, b) => b - a);
}

export async function getEntryById(
  id: number,
  locale = "de",
): Promise<PremiumVipAnimalEntryWithAnimal | null> {
  const row = await prisma.premiumVipAnimalEntry.findUnique({
    where: { id },
    include: animalInclude(locale),
  });
  if (!row) return null;
  return mapToEntry(row, locale);
}

export async function getAllAnimalsForBonusForm(locale: string): Promise<BonusAnimalFormAnimal[]> {
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
      identifier: data.identifier,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
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
      identifier: data.identifier,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      animalId: data.animalId,
      isNpc: data.isNpc,
    },
  });
  return { id: row.id };
}

export async function deleteEntry(id: number): Promise<void> {
  await prisma.premiumVipAnimalEntry.delete({ where: { id } });
}
