import { prisma } from "@/lib/prisma";
import { SpecialCoat } from "@/types/specialCoat";

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
        origin: true,
      },
    });
  } catch (error) {
    console.error("Fehler beim Laden der SpecialCoats im Service:", error);
    return [];
  }
}
