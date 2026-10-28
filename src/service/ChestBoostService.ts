import "server-only";
import prisma from "@/lib/prisma";
import type {
  ChestBoostListItem,
  ChestBoostDetail,
  ChestBoostCreateInput,
  ChestBoostUpdateInput,
} from "@/types/chestBoost";

function mapToListItem(raw: any, locale: string): ChestBoostListItem {
  const animalText =
    raw.animal.animaltext.find((t: any) => t.languageCode === locale) ??
    raw.animal.animaltext[0];
  const biomeText =
    raw.animal.biome?.biomestext?.find((t: any) => t.languageCode === locale) ??
    raw.animal.biome?.biomestext?.[0];

  return {
    id: raw.id,
    startDate: raw.startDate.toISOString(),
    endDate: raw.endDate.toISOString(),
    chestType: raw.chestType,
    isEvent: raw.isEvent,
    animal: {
      id: raw.animal.id,
      name: animalText?.animalName ?? "",
      identifier: raw.animal.identifier ?? null,
      biome: {
        id: raw.animal.biome?.id ?? 0,
        name: biomeText?.biomeName ?? "",
        identifier: raw.animal.biome?.identifier ?? "",
      },
    },
  };
}

const animalInclude = (locale: string) => ({
  animal: {
    include: {
      animaltext: { where: { languageCode: locale } },
      biome: {
        include: {
          biomestext: { where: { languageCode: locale } },
        },
      },
    },
  },
});

export async function getAllChestBoosts(locale: string): Promise<ChestBoostListItem[]> {
  const rows = await prisma.chestBoost.findMany({
    include: animalInclude(locale),
    orderBy: { startDate: "desc" },
  });
  return rows.map((r) => mapToListItem(r, locale));
}

export async function getChestBoostById(
  id: number,
  locale: string,
): Promise<ChestBoostDetail | null> {
  const row = await prisma.chestBoost.findUnique({
    where: { id },
    include: animalInclude(locale),
  });
  if (!row) return null;
  return mapToListItem(row, locale);
}

export async function getAllAnimalsForChestBoostForm(
  locale: string,
): Promise<{ id: number; name: string; identifier: string | null }[]> {
  const animals = await prisma.animal.findMany({
    include: {
      animaltext: { where: { languageCode: locale } },
    },
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

export async function createChestBoost(data: ChestBoostCreateInput): Promise<{ id: number }> {
  const row = await prisma.chestBoost.create({
    data: {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      chestType: data.chestType,
      isEvent: data.isEvent,
      animalId: data.animalId,
    },
  });
  return { id: row.id };
}

export async function updateChestBoost(
  id: number,
  data: ChestBoostUpdateInput,
): Promise<{ id: number }> {
  const row = await prisma.chestBoost.update({
    where: { id },
    data: {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      chestType: data.chestType,
      isEvent: data.isEvent,
      animalId: data.animalId,
    },
  });
  return { id: row.id };
}

export async function deleteChestBoost(id: number): Promise<void> {
  await prisma.chestBoost.delete({ where: { id } });
}
