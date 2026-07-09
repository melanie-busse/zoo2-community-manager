import "server-only";
import prisma from "@/lib/prisma";

export async function getCountAnimals() {
  return prisma.animal.count();
}

export async function getAllAnimals(locale: string = "de") {
  try {
    return await prisma.animal.findMany({
      include: {
        animaltext: {
          where: { languageCode: locale },
        },
        animalxp: true,
        biome: {
          include: {
            biomestext: {
              where: { languageCode: locale },
            },
          },
        },
        priceType: true,
      },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    // Auf einheitliches englisches Logging umgestellt
    console.error(`[AnimalService] Error in getAllAnimals (${locale}):`, error);
    return [];
  }
}

export async function getAnimalById(
  id: number | string,
  locale: string | null = null,
): Promise<any | null> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    console.warn(`[AnimalService] getAnimalById aborted: ID is not a number: ${id}`);
    return null;
  }

  const animal = await prisma.animal.findUnique({
    where: { id: numericId },
    include: {
      animaltext: locale ? { where: { languageCode: locale } } : true,
      specialcoat: {
        include: {
          specialcoatsorigin: {
            include: {
              origin: true,
            },
          },
        },
      },
      biome: {
        include: {
          biomestext: locale ? { where: { languageCode: locale } } : true,
        },
      },
      animalxp: { include: { xptype: true } },
      priceType: true,
      animalorigins: { include: { origin: true } },
      animalperenclosure: { orderBy: { numberAnimals: "asc" } },
    },
  });

  if (!animal) return null;

  return animal;
}

export async function createAnimal(animalData: any) {
  const {
    animaltext,
    releaseDate,
    price,
    currencyId,
    sellingPrice,
    popularity,
    releaseExp,
    biomeId,
    breedingLevel,
    breedingCost,
    breedingDuration,
    breedingProbability,
    actions,
    origins,
    enclosureSizes,
  } = animalData;

  const formattedReleaseDate = releaseDate ? new Date(releaseDate) : null;

  const insertData: any = {
    releaseDate: formattedReleaseDate,
    priceTypeId: currencyId ?? 1,
  };

  if (price) insertData.price = parseInt(price.toString(), 10);
  if (sellingPrice) insertData.sellingPrice = parseInt(sellingPrice.toString(), 10);
  if (popularity) insertData.popularity = parseInt(popularity.toString(), 10);
  if (releaseExp) insertData.releaseExp = parseInt(releaseExp.toString(), 10);
  if (biomeId) insertData.biomeId = parseInt(biomeId.toString(), 10);
  if (breedingLevel) insertData.shelterLevel = parseInt(breedingLevel.toString(), 10);
  if (breedingCost) insertData.breedingCost = parseInt(breedingCost.toString(), 10);
  if (breedingDuration) insertData.breedingDuration = parseInt(breedingDuration.toString(), 10);
  if (breedingProbability)
    insertData.breedingProbability = parseInt(breedingProbability.toString(), 10);

  return await prisma.$transaction(async (tx) => {
    const animal = await tx.animal.create({
      data: insertData,
    });

    if (Array.isArray(animaltext) && animaltext.length > 0) {
      await tx.animalText.createMany({
        data: animaltext.map((t: any) => ({
          animalId: animal.id,
          languageCode: t.languageCode,
          animalName: t.animalName || "",
          animalDescription: t.animalDescription || "",
        })),
      });
    }

    const xpTypeMap: Record<string, number> = { feed: 1, play: 2, clean: 3 };
    const xpData = [];

    if (actions) {
      for (const [key, action] of Object.entries(actions) as [string, any][]) {
        if (action.xp || action.durationHours || action.durationMinutes) {
          const totalMinutes =
            parseInt(action.durationHours || 0, 10) * 60 +
            parseInt(action.durationMinutes || 0, 10);

          xpData.push({
            animalId: animal.id,
            xpTypeId: xpTypeMap[key],
            xpValue: parseInt(action.xp || 0, 10),
            xpDuration: totalMinutes,
          });
        }
      }
    }

    if (xpData.length > 0) {
      await tx.animalXP.createMany({ data: xpData });
    }

    if (Array.isArray(enclosureSizes) && enclosureSizes.length > 0) {
      await tx.animalPerEnclosure.createMany({
        data: enclosureSizes.map((size: any) => ({
          animalId: animal.id,
          numberAnimals: parseInt(size.animalCount.toString(), 10),
          numberEnclosure: parseInt(size.size.toString(), 10),
        })),
      });
    }

    if (Array.isArray(origins) && origins.length > 0) {
      await tx.animalOrigin.createMany({
        data: origins.map((o: any) => ({
          animalId: animal.id,
          originId: parseInt(o.id.toString(), 10),
        })),
      });
    }

    return animal;
  });
}

export async function updateAnimal(id: number, animalData: any) {
  const {
    animaltext,
    releaseDate,
    price,
    currencyId,
    sellingPrice,
    popularity,
    releaseExp,
    biomeId,
    breedingLevel,
    breedingCost,
    breedingDuration,
    breedingProbability,
    actions,
    origins,
    enclosureSizes,
  } = animalData;

  const formattedReleaseDate = releaseDate ? new Date(releaseDate) : null;

  return await prisma.$transaction(async (tx) => {
    const animal = await tx.animal.update({
      where: { id: id },
      data: {
        releaseDate: formattedReleaseDate,
        price: price,
        priceTypeId: currencyId ?? 1,
        sellingPrice: sellingPrice,
        popularity: popularity,
        releaseExp: releaseExp,
        biomeId: biomeId,
        shelterLevel: breedingLevel,
        breedingCost: breedingCost,
        breedingDuration: breedingDuration,
        breedingProbability: breedingProbability,
      },
    });

    await tx.animalText.deleteMany({ where: { animalId: id } });

    if (Array.isArray(animaltext) && animaltext.length > 0) {
      await tx.animalText.createMany({
        data: animaltext.map((t: any) => ({
          animalId: id,
          languageCode: t.languageCode,
          animalName: t.animalName || "",
          animalDescription: t.animalDescription || "",
        })),
      });
    }

    await tx.animalXP.deleteMany({ where: { animalId: id } });

    const xpTypeMap: Record<string, number> = { feed: 1, play: 2, clean: 3 };
    const xpData = [];

    if (actions) {
      for (const [key, action] of Object.entries(actions) as [string, any][]) {
        if (
          action.xp !== null ||
          action.durationHours !== null ||
          action.durationMinutes !== null
        ) {
          const hours = action.durationHours || 0;
          const minutes = action.durationMinutes || 0;
          const totalMinutes = hours * 60 + minutes;

          xpData.push({
            animalId: id,
            xpTypeId: xpTypeMap[key],
            xpValue: action.xp || 0,
            xpDuration: totalMinutes,
          });
        }
      }
    }

    if (xpData.length > 0) {
      await tx.animalXP.createMany({ data: xpData });
    }

    await tx.animalPerEnclosure.deleteMany({ where: { animalId: id } });
    if (Array.isArray(enclosureSizes) && enclosureSizes.length > 0) {
      await tx.animalPerEnclosure.createMany({
        data: enclosureSizes.map((size: any) => ({
          animalId: id,
          numberAnimals: parseInt(size.animalCount.toString(), 10),
          numberEnclosure: parseInt(size.size.toString(), 10),
        })),
      });
    }

    await tx.animalOrigin.deleteMany({ where: { animalId: id } });
    if (Array.isArray(origins) && origins.length > 0) {
      await tx.animalOrigin.createMany({
        data: origins.map((o: any) => ({
          animalId: id,
          originId: parseInt(o.id.toString(), 10),
        })),
      });
    }

    return animal;
  });
}

export async function deleteAnimal(id: number) {
  return await prisma.animal.delete({ where: { id } });
}
