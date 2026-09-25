import "server-only";
import prisma from "@/lib/prisma";
import { BiomeStatistic } from "@/types/zooStatistic";

export type { BiomeStatistic };

export async function getZooStatistics(locale: string = "de"): Promise<BiomeStatistic[]> {
  try {
    const biomes = await prisma.biome.findMany({
      include: {
        biomestext: { where: { languageCode: locale } },
        region: {
          include: {
            regionTexts: { where: { languageCode: locale } },
          },
        },
        animals: {
          include: {
            specialcoat: { select: { id: true } },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return biomes.map((biome) => {
      const animals = biome.animals;
      const shelterLevelCounts: Record<number, number> = {};

      for (const animal of animals) {
        const level = animal.shelterLevel ?? 0;
        shelterLevelCounts[level] = (shelterLevelCounts[level] ?? 0) + 1;
      }

      return {
        biomeId: biome.id,
        biomeName: biome.biomestext[0]?.biomeName ?? biome.identifier,
        biomeIdentifier: biome.identifier,
        region: biome.region?.regionTexts[0]?.name ?? biome.region?.identifier ?? null,
        totalAnimals: animals.length,
        animalsForZoodollar: animals.filter((a) => a.priceTypeId === 1).length,
        animalsForDiamond: animals.filter((a) => a.priceTypeId === 2).length,
        totalSpecialCoats: animals.reduce((sum, a) => sum + a.specialcoat.length, 0),
        shelterLevelCounts,
      };
    });
  } catch (error) {
    console.error("[ZooStatisticService] Error in getZooStatistics:", error);
    return [];
  }
}