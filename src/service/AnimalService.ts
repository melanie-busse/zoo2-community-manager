import "server-only";
import prisma from "@/lib/prisma";

export async function getCountAnimals() {
  return prisma.animal.count();
}

export async function getCountSpecialCoats() {
  return prisma.specialCoat.count();
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
    console.error(`[AnimalService] Fehler in getAllAnimals (${locale}):`, error);

    return [];
  }
}

export async function getAnimalById(
  id: number | string,
  locale: string | null = null,
): Promise<any | null> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    console.warn(`getAnimalById aborted: ID is not a number: ${id}`);
    return null;
  }

  const animal = await prisma.animal.findUnique({
    where: { id: numericId },
    include: {
      animaltext: locale ? { where: { languageCode: locale } } : true,
      specialcoat: { include: { origin: true } },
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
    nameDe,
    descriptionDe,
    translations,
    releaseDate,
    price,
    priceType,
    sellValue,
    popularity,
    auswildern,
    enclosureType,
    breedingLevel,
    breedingCosts,
    breedingDuration,
    breedingChance,
    actions,
    origins,
    enclosureSizes,
  } = animalData;

  const priceTypeId = priceType === "Zoodollar" ? 1 : 2;
  const formattedReleaseDate = releaseDate ? new Date(releaseDate) : null;

  return await prisma.$transaction(async (tx) => {
    const animal = await tx.animal.create({
      data: {
        releaseDate: formattedReleaseDate,
        price: price ? parseInt(price.toString(), 10) : null,
        priceTypeId: priceTypeId,
        sellingPrice: sellValue ? parseInt(sellValue.toString(), 10) : null,
        popularity: popularity ? parseInt(popularity.toString(), 10) : null,
        releaseExp: auswildern ? parseInt(auswildern.toString(), 10) : null,
        biomeId: parseInt(enclosureType.toString(), 10),
        shelterLevel: breedingLevel ? parseInt(breedingLevel.toString(), 10) : null,
        breedingCost: breedingCosts ? parseInt(breedingCosts.toString(), 10) : null,
        breedingDuration: breedingDuration ? parseInt(breedingDuration.toString(), 10) : null,
        breedingProbability: breedingChance ? parseInt(breedingChance.toString(), 10) : null,
      },
    });

    if (Array.isArray(translations) && translations.length > 0) {
      await tx.animalText.createMany({
        data: translations.map((t: any) => ({
          animalId: animal.id,
          languageCode: t.spracheCode, // kommt aus deinem Form-State
          animalName: t.name || "",
          animalDescription: t.description || "",
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
    nameDe,
    descriptionDe,
    translations,
    releaseDate,
    price,
    currencyId,
    sellPrice,
    popularity,
    releaseTickets,
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
        priceTypeId: currencyId ?? 1, // Nutzt jetzt die ID (1 = Zoodollar, 2 = Diamanten)
        sellingPrice: sellPrice,
        popularity: popularity,
        releaseExp: releaseTickets,
        biomeId: biomeId,
        shelterLevel: breedingLevel,
        breedingCost: breedingCost,
        breedingDuration: breedingDuration,
        breedingProbability: breedingProbability,
      },
    });

    await tx.animalText.deleteMany({ where: { animalId: id } });

    if (Array.isArray(translations) && translations.length > 0) {
      await tx.animalText.createMany({
        data: translations.map((t: any) => ({
          animalId: id,
          languageCode: t.spracheCode,
          animalName: t.name || "",
          animalDescription: t.description || "",
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
          numberAnimals: parseInt(size.animalCount.toString(), 10), // Bleibt zur Sicherheit falls aus Custom-UI
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
