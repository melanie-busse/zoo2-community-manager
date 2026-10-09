import "server-only";
import prisma from "@/lib/prisma";

type TroughData    = { price: number; pricetype: number };
type WaterHoleData = { price: number; pricetype: number; repair: number };
type ShelterData   = { level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null };

type NestedBiomeData = {
  identifier: string;
  price: number | null;
  priceTypeId: number | null;
  expansionsCost: number | null;
  priceTypeExpansionsCostId: number | null;
  size: number | null;
  regionId: number | null;
  biomestext: { languageCode: string; biomeName: string; biomeDescription: string }[];
  troughs?: TroughData[];
  waterHoles?: WaterHoleData[];
  shelters?: ShelterData[];
  gameIds?: number[];
};

export async function getAllBiomeGames(locale: string = "de") {
  return prisma.biomeGame.findMany({
    include: { texts: { where: { languageCode: locale } } },
    orderBy: { identifier: "asc" },
  });
}

export async function getHabitatCount() {
  return prisma.biome.count();
}

export async function getAllBiomes(locale: string = "de") {
  try {
    return await prisma.biome.findMany({
      include: {
        biomestext: locale ? { where: { languageCode: locale } } : true,
      },
      orderBy: {
        identifier: "asc",
      },
    });
  } catch (error) {
    console.error(`[BiomeService] Error in getAllBiomes (${locale}):`, error);
    return [];
  }
}

export async function getBiomeById(id: number, locale: string = "de") {
  return prisma.biome.findUnique({
    where: { id },
    include: {
      biomestext: { where: { languageCode: locale } },
      priceType: true,
      shelters: { orderBy: { level: "asc" } },
      troughs: true,
      waterHoles: true,
      games: {
        include: { texts: { where: { languageCode: locale } } },
        orderBy: { identifier: "asc" },
      },
    },
  });
}

export async function getAllBiomesForOverview(locale: string = "de") {
  return prisma.biome.findMany({
    include: {
      biomestext: { where: { languageCode: locale } },
      priceType: true,
    },
    orderBy: { identifier: "asc" },
  });
}

export async function getBiomeByIdForEdit(id: number) {
  return prisma.biome.findUnique({
    where: { id },
    include: {
      biomestext: true,
      troughs: true,
      waterHoles: true,
      shelters: { orderBy: { level: "asc" } },
      games: { select: { id: true } },
    },
  });
}

export async function createBiome(data: NestedBiomeData): Promise<{ id: number }> {
  return prisma.$transaction(async (tx) => {
    const biome = await tx.biome.create({
      data: {
        identifier: data.identifier,
        price: data.price,
        priceTypeId: data.priceTypeId,
        expansionsCost: data.expansionsCost,
        priceTypeExpansionsCostId: data.priceTypeExpansionsCostId,
        size: data.size,
        regionId: data.regionId,
        biomestext: {
          createMany: {
            data: data.biomestext.filter((t) => t.biomeName !== ""),
          },
        },
      },
    });

    if (data.troughs?.length) {
      await tx.biomeTrough.createMany({ data: data.troughs.map((r) => ({ ...r, biomeId: biome.id })) });
    }
    if (data.waterHoles?.length) {
      await tx.biomeWaterHole.createMany({ data: data.waterHoles.map((r) => ({ ...r, biomeId: biome.id })) });
    }
    if (data.shelters?.length) {
      await tx.biomeShelter.createMany({ data: data.shelters.map((r) => ({ ...r, biomeId: biome.id })) });
    }
    if (data.gameIds?.length) {
      await tx.biome.update({
        where: { id: biome.id },
        data: { games: { connect: data.gameIds.map((id) => ({ id })) } },
      });
    }

    return { id: biome.id };
  });
}

export async function updateBiome(id: number, data: NestedBiomeData): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.biome.update({
      where: { id },
      data: {
        identifier: data.identifier,
        price: data.price,
        priceTypeId: data.priceTypeId,
        expansionsCost: data.expansionsCost,
        priceTypeExpansionsCostId: data.priceTypeExpansionsCostId,
        size: data.size,
        regionId: data.regionId,
      },
    });

    // biomestext
    await tx.biomesText.deleteMany({ where: { biomeId: id } });
    const validTexts = data.biomestext.filter((t) => t.biomeName !== "");
    if (validTexts.length > 0) {
      await tx.biomesText.createMany({ data: validTexts.map((t) => ({ biomeId: id, ...t })) });
    }

    // troughs
    await tx.biomeTrough.deleteMany({ where: { biomeId: id } });
    if (data.troughs?.length) {
      await tx.biomeTrough.createMany({ data: data.troughs.map((r) => ({ ...r, biomeId: id })) });
    }

    // waterHoles
    await tx.biomeWaterHole.deleteMany({ where: { biomeId: id } });
    if (data.waterHoles?.length) {
      await tx.biomeWaterHole.createMany({ data: data.waterHoles.map((r) => ({ ...r, biomeId: id })) });
    }

    // shelters
    await tx.biomeShelter.deleteMany({ where: { biomeId: id } });
    if (data.shelters?.length) {
      await tx.biomeShelter.createMany({ data: data.shelters.map((r) => ({ ...r, biomeId: id })) });
    }

    // games — set replaces all connections
    await tx.biome.update({
      where: { id },
      data: {
        games: {
          set: (data.gameIds ?? []).map((gid) => ({ id: gid })),
        },
      },
    });
  });
}

export async function deleteBiome(id: number): Promise<void> {
  await prisma.$transaction([
    prisma.biomesText.deleteMany({ where: { biomeId: id } }),
    prisma.biome.delete({ where: { id } }),
  ]);
}
