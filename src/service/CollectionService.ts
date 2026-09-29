import "server-only";
import { prisma } from "@/lib/prisma";
import { Collection } from "@/types/collection";

export async function getAllCollections(locale: string): Promise<Collection[]> {
  const collections = await prisma.collection.findMany({
    include: {
      texts: { where: { languageCode: locale } },
      region: {
        include: {
          regionTexts: { where: { languageCode: locale } },
        },
      },
      requirements: {
        orderBy: { sortOrder: "asc" },
        include: {
          animal: { include: { biome: true, animaltext: { where: { languageCode: locale } } } },
          specialCoat: {
            include: {
              specialcoatstext: { where: { languageCode: locale } },
              animal: { include: { biome: true } },
            },
          },
        },
      },
      rewardAnimal: {
        include: {
          biome: true,
          animaltext: { where: { languageCode: locale } },
        },
      },
      rewardSpecialCoat: {
        include: {
          specialcoatstext: { where: { languageCode: locale } },
          animal: {
            include: { biome: true },
          },
        },
      },
    },
    orderBy: [{ regionId: "asc" }, { stars: "asc" }, { id: "asc" }],
  });

  return collections.map((c) => ({
    id: c.id,
    identifier: c.identifier,
    stars: c.stars,
    region: {
      id: c.region.id,
      identifier: c.region.identifier,
      name: c.region.regionTexts[0]?.name ?? c.region.identifier,
    },
    name: c.texts[0]?.name ?? c.identifier,
    requirements: c.requirements.map((r) => ({
      id: r.id,
      type: r.type,
      requiredLevel: r.requiredLevel,
      itemName: r.itemName,
      sortOrder: r.sortOrder,
      animal: r.animal
        ? {
            id: r.animal.id,
            identifier: r.animal.identifier,
            name: r.animal.animaltext[0]?.animalName ?? r.animal.identifier ?? undefined,
            biome: r.animal.biome
              ? { id: r.animal.biome.id, identifier: r.animal.biome.identifier, name: "" }
              : undefined,
          }
        : null,
      specialCoat: r.specialCoat
        ? {
            id: r.specialCoat.id,
            animalId: r.specialCoat.animalId,
            identifier: r.specialCoat.identifier,
            releaseDate: r.specialCoat.releaseDate,
            specialcoatstext: r.specialCoat.specialcoatstext,
            animal: r.specialCoat.animal
              ? {
                  id: r.specialCoat.animal.id,
                  identifier: r.specialCoat.animal.identifier,
                  biome: r.specialCoat.animal.biome
                    ? { id: r.specialCoat.animal.biome.id, identifier: r.specialCoat.animal.biome.identifier, name: "" }
                    : undefined,
                }
              : undefined,
          }
        : null,
    })),
    rewardAnimal: c.rewardAnimal
      ? {
          id: c.rewardAnimal.id,
          identifier: c.rewardAnimal.identifier,
          name: c.rewardAnimal.animaltext[0]?.animalName ?? c.rewardAnimal.identifier ?? "",
          biome: c.rewardAnimal.biome
            ? { id: c.rewardAnimal.biome.id, identifier: c.rewardAnimal.biome.identifier, name: "" }
            : undefined,
        }
      : null,
    rewardSpecialCoat:
      c.rewardSpecialCoat && c.rewardSpecialCoatId !== 0
        ? {
            id: c.rewardSpecialCoat.id,
            animalId: c.rewardSpecialCoat.animalId,
            identifier: c.rewardSpecialCoat.identifier,
            releaseDate: c.rewardSpecialCoat.releaseDate,
            specialcoatstext: c.rewardSpecialCoat.specialcoatstext,
            animal: c.rewardSpecialCoat.animal
              ? {
                  id: c.rewardSpecialCoat.animal.id,
                  identifier: c.rewardSpecialCoat.animal.identifier,
                  biome: c.rewardSpecialCoat.animal.biome
                    ? { id: c.rewardSpecialCoat.animal.biome.id, identifier: c.rewardSpecialCoat.animal.biome.identifier, name: "" }
                    : undefined,
                }
              : undefined,
          }
        : null,
  }));
}
