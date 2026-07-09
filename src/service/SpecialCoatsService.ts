import "server-only";
import { prisma } from "@/lib/prisma";
import { CreateSpecialCoatInput } from "@/types/specialCoat";

export async function getCountSpecialCoats() {
  return prisma.specialCoat.count();
}

export async function getAllSpecialCoats(locale: string = "de") {
  try {
    return await prisma.specialCoat.findMany({
      include: {
        specialcoatstext: {
          where: {
            languageCode: locale,
          },
        },
        animal: {
          include: {
            animaltext: {
              where: {
                languageCode: locale,
              },
            },
            priceType: true,
            biome: {
              include: {
                biomestext: {
                  where: { languageCode: locale },
                },
              },
            },
          },
        },
        specialcoatsorigin: {
          include: {
            origin: true,
          },
        },
      },
    });
  } catch (error) {
    // Auf einheitliches englisches Logging umgestellt
    console.error(`[SpecialCoatsService] Error loading SpecialCoats (${locale}):`, error);
    return [];
  }
}

export async function getSpecialCoatById(
  id: number | string,
  locale: string | null = null,
): Promise<any | null> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    console.warn(`[SpecialCoatsService] getSpecialCoatById aborted: ID is not a number: ${id}`);
    return null;
  }

  const specialCoat = await prisma.specialCoat.findUnique({
    where: { id: numericId },
    include: {
      specialcoatstext: locale ? { where: { languageCode: locale } } : true,
      animal: {
        include: {
          animaltext: locale ? { where: { languageCode: locale } } : true,
          priceType: true,
          biome: {
            include: {
              biomestext: locale ? { where: { languageCode: locale } } : true,
            },
          },
        },
      },
      specialcoatsorigin: {
        include: {
          origin: true,
        },
      },
    },
  });

  if (!specialCoat) return null;

  return specialCoat;
}

export async function createSpecialCoat(data: CreateSpecialCoatInput) {
  const newCoat = await prisma.specialCoat.create({
    data: {
      animalId: data.animalId,
      releaseDate: new Date(data.releaseDate),
      image: data.image,
      specialcoatstext: {
        create: data.texts.map((text) => ({
          languageCode: text.languageCode,
          name: text.name,
          color: text.color,
        })),
      },
    },
  });

  if (data.originIds && data.originIds.length > 0) {
    await prisma.specialCoatsOrigin.createMany({
      data: data.originIds.map((id) => ({
        specialCoatId: newCoat.id,
        originId: id,
      })),
    });
  }

  return prisma.specialCoat.findUnique({
    where: { id: newCoat.id },
    include: {
      specialcoatstext: true,
      specialcoatsorigin: {
        include: {
          origin: true,
        },
      },
    },
  });
}

export async function updateSpecialCoat(id: number | string, data: any) {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId)) {
    throw new Error(`[SpecialCoatsService] updateSpecialCoat aborted: Invalid ID: ${id}`);
  }

  return prisma.$transaction(async (tx) => {
    await tx.specialCoat.update({
      where: { id: numericId },
      data: {
        animalId: data.animalId,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        image: data.image,
      },
    });

    if (data.texts) {
      await tx.specialCoatsText.deleteMany({
        where: { specialCoatId: numericId },
      });

      await tx.specialCoatsText.createMany({
        data: data.texts.map((text: any) => ({
          specialCoatId: numericId,
          languageCode: text.languageCode,
          name: text.name,
          color: text.color,
        })),
      });
    }

    if (data.originIds) {
      await tx.specialCoatsOrigin.deleteMany({
        where: { specialCoatId: numericId },
      });

      if (data.originIds.length > 0) {
        await tx.specialCoatsOrigin.createMany({
          data: data.originIds.map((originId: number) => ({
            specialCoatId: numericId,
            originId: originId,
          })),
        });
      }
    }

    return tx.specialCoat.findUnique({
      where: { id: numericId },
      include: {
        specialcoatstext: true,
        specialcoatsorigin: {
          include: {
            origin: true,
          },
        },
      },
    });
  });
}
