import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAnimalDetails, parseAnimalData } from "@/service/FandonApi";
import { createAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";

export async function POST(request: Request) {
  try {
    const { pageTitle, originIdsFromOverview } = await request.json();

    if (!pageTitle) {
      return NextResponse.json({ error: "pageTitle ist erforderlich" }, { status: 400 });
    }

    // 1. Details aus dem Fandom Wiki laden
    const wikiJson = await fetchAnimalDetails(pageTitle);
    if (!wikiJson) {
      return NextResponse.json(
        { error: `Keine Wiki-Daten für ${pageTitle} gefunden` },
        { status: 404 },
      );
    }

    // 2. Daten "steckerfertig" für den AnimalService parsen
    const parsedAnimal = parseAnimalData(wikiJson, originIdsFromOverview || []);
    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Fehler beim Parsen der Daten für ${pageTitle}` },
        { status: 500 },
      );
    }

    // 3. Dynamische Biome-ID aus der DB holen
    let biome = null;

    if (parsedAnimal.wikiBiomeName) {
      biome = await prisma.biome.findFirst({
        where: {
          identifier: parsedAnimal.wikiBiomeName, // Einfacher, direkter String-Match
        },
      });
    }

    // Falls das Biom neu im Spiel ist und in deiner DB fehlt, legen wir es dynamisch an
    if (!biome && parsedAnimal.wikiBiomeName) {
      biome = await prisma.biome.create({
        data: {
          identifier: parsedAnimal.wikiBiomeName,
        },
      });
    }
    // BiomeId an das Objekt hängen
    const finalAnimalData = {
      ...parsedAnimal,
      biomeId: biome ? biome.id : 1, // Fallback auf ID 1, falls gar nichts greift
    };

    // 4. Haupttier über deinen Service in der DB anlegen
    const newAnimal = await createAnimal(finalAnimalData);

    // 5. Farbvarianten verarbeiten (jetzt, wo newAnimal.id existiert!)
    const createdCoats = [];
    if (parsedAnimal.rawColorVariants && parsedAnimal.rawColorVariants.length > 0) {
      for (const variant of parsedAnimal.rawColorVariants) {
        // Dynamisch die IDs für die Herkunft (Origins) aus der DB holen
        // Wir matchen die Wiki-Strings (z.B. "Collections") gegen deine DB-Namen
        const dbOrigins = await prisma.origin.findMany({
          where: {
            name: { in: variant.obtainedFrom }, // identifier nutzen und ohne mode!
          },
        });

        // Falls eine Herkunftsart in deiner DB fehlt, legen wir sie optional an
        // oder nehmen nur die, die wir matchen konnten:
        const originIds = dbOrigins.map((o) => o.id);

        // Input-Objekt für deinen createSpecialCoat-Service bauen
        const coatInput = {
          animalId: newAnimal.id,
          releaseDate: variant.releaseDate ? new Date(variant.releaseDate) : new Date(),
          image: variant.imageName || "",
          originIds: originIds,
          texts: [
            {
              languageCode: "en",
              name: variant.name,
              color: variant.name, // Oder Standardfarbe/Hexcode falls vorhanden
            },
          ],
        };

        // Über deinen Service anlegen lassen
        const newCoat = await createSpecialCoat(coatInput);
        createdCoats.push(newCoat);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Tier '${pageTitle}' und ${createdCoats.length} Farbvarianten erfolgreich importiert.`,
      animal: newAnimal,
      coats: createdCoats,
    });
  } catch (error: any) {
    console.error("Import Fehler:", error);
    return NextResponse.json({ error: error.message || "Interner Serverfehler" }, { status: 500 });
  }
}
