import "server-only";
import { prisma } from "@/lib/prisma";
import { Collection, CollectionInput, RawCollection } from "@/types/collection";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

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
          decoration: {
            include: {
              texts: { where: { languageCode: locale } },
              category: true,
            },
          },
          statue: {
            include: {
              animal: { include: { biome: true, animaltext: { where: { languageCode: locale } } } },
              contest: true,
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
    rewardVariant: c.rewardVariant ?? null,
    region: {
      id: c.region.id,
      identifier: c.region.identifier,
      name: c.region.regionTexts[0]?.name ?? c.region.identifier,
    },
    name: c.texts[0]?.name ?? c.identifier,
    requirements: c.requirements.map((r) => ({
      id: r.id,
      type: r.type as "ANIMAL" | "DECORATION" | "STATUE",
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
      decoration: r.decoration
        ? {
            id: r.decoration.id,
            identifier: r.decoration.identifier,
            name: r.decoration.texts[0]?.name ?? r.decoration.identifier,
            category: { identifier: r.decoration.category.identifier },
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
      statue: r.statue
        ? {
            id: r.statue.id,
            animalName: r.statue.animal.animaltext[0]?.animalName ?? r.statue.animal.identifier ?? "",
            contestName: r.statue.contest.endDate.getFullYear().toString(),
            animalIdentifier: r.statue.animal.identifier ?? "",
            biomeIdentifier: r.statue.animal.biome?.identifier ?? "",
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

export async function getAllCollectionsForAdmin(): Promise<RawCollection[]> {
  const collections = await prisma.collection.findMany({
    include: {
      texts: { select: { languageCode: true, name: true } },
      requirements: {
        select: {
          id: true,
          type: true,
          animalId: true,
          statueId: true,
          requiredLevel: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ regionId: "asc" }, { stars: "asc" }, { id: "asc" }],
  });

  return collections.map((c) => ({
    id: c.id,
    identifier: c.identifier,
    stars: c.stars,
    regionId: c.regionId,
    rewardAnimalId: c.rewardAnimalId ?? null,
    rewardVariant: c.rewardVariant ?? null,
    texts: c.texts.map((t) => ({ languageCode: t.languageCode, name: t.name })),
    requirements: c.requirements.map((r) => ({
      id: r.id,
      type: r.type as "ANIMAL" | "STATUE",
      animalId: r.animalId ?? null,
      statueId: r.statueId ?? null,
      requiredLevel: r.requiredLevel ?? null,
      sortOrder: r.sortOrder,
    })),
  }));
}

export async function getAllContestStatues(): Promise<{ id: number; animalName: string; contestName: string }[]> {
  const statues = await prisma.contestStatue.findMany({
    include: {
      animal: { include: { animaltext: { where: { languageCode: "de" } } } },
      contest: true,
    },
    orderBy: { id: "asc" },
  });

  return statues.map((s) => ({
    id: s.id,
    animalName: s.animal.animaltext[0]?.animalName ?? s.animal.identifier ?? "",
    contestName: s.contest.endDate.getFullYear().toString(),
  }));
}

export async function createCollection(data: CollectionInput): Promise<{ id: number }> {
  const identifier = slugify(data.texts[0]?.name ?? "collection");

  return prisma.$transaction(async (tx) => {
    const collection = await tx.collection.create({
      data: {
        identifier,
        stars: data.stars,
        regionId: data.regionId,
        rewardAnimalId: data.rewardAnimalId,
        rewardVariant: data.rewardVariant,
      },
    });

    if (data.texts.length > 0) {
      await tx.collectionText.createMany({
        data: data.texts
          .filter((t) => t.name.trim())
          .map((t) => ({ collectionId: collection.id, languageCode: t.languageCode, name: t.name.trim() })),
      });
    }

    if (data.requirements.length > 0) {
      await tx.collectionRequirement.createMany({
        data: data.requirements.map((r) => ({
          collectionId: collection.id,
          type: r.type,
          animalId: r.animalId,
          statueId: r.statueId,
          requiredLevel: r.requiredLevel,
          sortOrder: r.sortOrder,
          itemName: "",
        })),
      });
    }

    return { id: collection.id };
  });
}

export async function updateCollection(id: number, data: CollectionInput): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.collection.update({
      where: { id },
      data: {
        stars: data.stars,
        regionId: data.regionId,
        rewardAnimalId: data.rewardAnimalId,
        rewardVariant: data.rewardVariant,
      },
    });

    await tx.collectionText.deleteMany({ where: { collectionId: id } });
    await tx.collectionRequirement.deleteMany({ where: { collectionId: id } });

    if (data.texts.length > 0) {
      await tx.collectionText.createMany({
        data: data.texts
          .filter((t) => t.name.trim())
          .map((t) => ({ collectionId: id, languageCode: t.languageCode, name: t.name.trim() })),
      });
    }

    if (data.requirements.length > 0) {
      await tx.collectionRequirement.createMany({
        data: data.requirements.map((r) => ({
          collectionId: id,
          type: r.type,
          animalId: r.animalId,
          statueId: r.statueId,
          requiredLevel: r.requiredLevel,
          sortOrder: r.sortOrder,
          itemName: "",
        })),
      });
    }
  });
}

export async function deleteCollection(id: number): Promise<void> {
  await prisma.collection.delete({ where: { id } });
}
