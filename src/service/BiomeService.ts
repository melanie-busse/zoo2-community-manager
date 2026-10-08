import "server-only";
import prisma from "@/lib/prisma";

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
    include: { biomestext: true },
  });
}

export async function createBiome(data: {
  identifier: string;
  price: number | null;
  priceTypeId: number | null;
  expansionsCost: number | null;
  priceTypeExpansionsCostId: number | null;
  size: number | null;
  regionId: number | null;
  biomestext: { languageCode: string; biomeName: string; biomeDescription: string }[];
}): Promise<{ id: number }> {
  const biome = await prisma.biome.create({
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
  return { id: biome.id };
}

export async function updateBiome(
  id: number,
  data: {
    identifier: string;
    price: number | null;
    priceTypeId: number | null;
    expansionsCost: number | null;
    priceTypeExpansionsCostId: number | null;
    size: number | null;
    regionId: number | null;
    biomestext: { languageCode: string; biomeName: string; biomeDescription: string }[];
  },
): Promise<void> {
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
    await tx.biomesText.deleteMany({ where: { biomeId: id } });
    const validTexts = data.biomestext.filter((t) => t.biomeName !== "");
    if (validTexts.length > 0) {
      await tx.biomesText.createMany({
        data: validTexts.map((t) => ({ biomeId: id, ...t })),
      });
    }
  });
}

export async function deleteBiome(id: number): Promise<void> {
  await prisma.$transaction([
    prisma.biomesText.deleteMany({ where: { biomeId: id } }),
    prisma.biome.delete({ where: { id } }),
  ]);
}
