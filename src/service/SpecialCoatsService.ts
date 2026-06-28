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
  try {
    return await prisma.specialCoat.create({
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
        
        specialcoatsorigin: {
          create: data.originIds.map((id) => ({
            originId: id,
          })),
        },
      },
      include: {
        specialcoatstext: true,
        specialcoatsorigin: {
          include: {
            origin: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des SpecialCoat im Service:", error);
    throw new Error("Farbvariante konnte nicht erstellt werden.");
  }
}
