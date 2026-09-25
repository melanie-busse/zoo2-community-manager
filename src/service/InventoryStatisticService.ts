import "server-only";
import { prisma } from "@/lib/prisma";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";

export async function getInventoryStatistics(
  userId: number,
  locale: string = "de",
): Promise<InventoryBiomeStatistic[]> {
  try {
    const [biomes, inventoryAnimals, inventorySpecialCoats, inventoryStatues, inventoryContestCoats] =
      await Promise.all([
        prisma.biome.findMany({
          include: {
            biomestext: { where: { languageCode: locale } },
            region: { include: { regionTexts: { where: { languageCode: locale } } } },
            animals: {
              include: { specialcoat: { select: { id: true, isContestSpecialCoat: true } } },
            },
          },
          orderBy: { id: "asc" },
        }),
        prisma.zooInventoryAnimal.findMany({ where: { userid: userId } }),
        prisma.zooInventorySpecialCoat.findMany({ where: { userid: userId } }),
        prisma.zooInventoryStatue.findMany({ where: { userid: userId } }),
        prisma.zooInventoryContestSpecialCoat.findMany({ where: { userid: userId } }),
      ]);

    const ownedAnimalIds = new Set(
      inventoryAnimals.filter((i) => (i.count ?? 0) >= 1).map((i) => i.animalId),
    );
    const ownedSpecialCoatIds = new Set(
      inventorySpecialCoats.filter((i) => (i.count ?? 0) >= 1).map((i) => i.specialCoatId),
    );
    const ownedStatueAnimalIds = new Set(
      inventoryStatues.filter((i) => (i.puzzlePieces ?? 0) >= 1).map((i) => i.animalId),
    );
    const ownedContestCoatIds = new Set(
      inventoryContestCoats.filter((i) => (i.puzzlePieces ?? 0) >= 1).map((i) => i.specialCoatId),
    );

    return biomes.map((biome) => {
      const animals = biome.animals;
      const shelterLevelCounts: Record<number, number> = {};
      const ownedShelterLevelCounts: Record<number, number> = {};

      for (const animal of animals) {
        const level = animal.shelterLevel ?? 0;
        shelterLevelCounts[level] = (shelterLevelCounts[level] ?? 0) + 1;
        if (ownedAnimalIds.has(animal.id)) {
          ownedShelterLevelCounts[level] = (ownedShelterLevelCounts[level] ?? 0) + 1;
        }
      }

      const allSpecialCoats = animals.flatMap((a) => a.specialcoat);

      return {
        biomeId: biome.id,
        biomeName: biome.biomestext[0]?.biomeName ?? biome.identifier,
        biomeIdentifier: biome.identifier,
        region: biome.region?.regionTexts[0]?.name ?? biome.region?.identifier ?? null,
        totalAnimals: animals.length,
        animalsForZoodollar: animals.filter((a) => a.priceTypeId === 1).length,
        animalsForDiamond: animals.filter((a) => a.priceTypeId === 2).length,
        totalSpecialCoats: allSpecialCoats.length,
        shelterLevelCounts,
        contestStatues: animals.filter((a) => a.isContestAnimal).length,
        contestSpecialCoats: allSpecialCoats.filter((sc) => sc.isContestSpecialCoat).length,
        ownedAnimals: animals.filter((a) => ownedAnimalIds.has(a.id)).length,
        ownedSpecialCoats: allSpecialCoats.filter((sc) => ownedSpecialCoatIds.has(sc.id)).length,
        ownedAnimalsForZoodollar: animals.filter(
          (a) => a.priceTypeId === 1 && ownedAnimalIds.has(a.id),
        ).length,
        ownedAnimalsForDiamond: animals.filter(
          (a) => a.priceTypeId === 2 && ownedAnimalIds.has(a.id),
        ).length,
        ownedContestStatues: animals.filter(
          (a) => a.isContestAnimal && ownedStatueAnimalIds.has(a.id),
        ).length,
        ownedContestSpecialCoats: allSpecialCoats.filter(
          (sc) => sc.isContestSpecialCoat && ownedContestCoatIds.has(sc.id),
        ).length,
        ownedShelterLevelCounts,
      };
    });
  } catch (error) {
    console.error("[InventoryStatisticService] Error in getInventoryStatistics:", error);
    return [];
  }
}