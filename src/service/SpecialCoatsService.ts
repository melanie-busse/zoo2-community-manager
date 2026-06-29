import { prisma } from "@/lib/prisma";
import { CreateSpecialCoatInput } from "@/types/specialCoat";

/**
 * Holt alle Farbvarianten aus der Datenbank, passend zur gewählten Sprache (locale).
 * @param locale Die aktuelle Sprache (de, en, da, etc.)
 */
export async function getAllSpecialCoats(locale: string) {
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
            biome: true,
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
    console.error("Fehler beim Laden der SpecialCoats im Service:", error);
    return [];
  }
}

/**
 * Erstellt eine neue Farbvariante inklusive ihrer Übersetzungen und Herkunfts-Verknüpfungen.
 */
export async function createSpecialCoat(data: CreateSpecialCoatInput) {
  // 1. Erstelle den SpecialCoat und die Texte
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

  // 2. Erstelle die Einträge in der Join-Tabelle, falls originIds übergeben wurden
  if (data.originIds && data.originIds.length > 0) {
    await prisma.specialCoatsOrigin.createMany({
      data: data.originIds.map((id) => ({
        specialCoatId: newCoat.id,
        originId: id,
      })),
    });
  }

  // 3. Hole das vollständige Objekt inklusive aller Relationen zurück
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
