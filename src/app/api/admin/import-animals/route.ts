import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAnimalDetails, parseAnimalData, extractIconsFromOverview } from "@/service/FandomApi";
import { createAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";

export async function POST(request: Request) {
  try {
    const { pageTitle } = await request.json();

    if (!pageTitle) {
      return NextResponse.json({ error: "pageTitle ist erforderlich" }, { status: 400 });
    }

    const wikiJson = await fetchAnimalDetails(pageTitle);
    if (!wikiJson) {
      return NextResponse.json(
        { error: `Keine Wiki-Daten für ${pageTitle} gefunden` },
        { status: 404 },
      );
    }

    let originIds: number[] = [];
    try {
      const overviewPage = await fetchAnimalDetails("Animals");
      const overviewWikitext = overviewPage?.wikitext?.["*"] || "";

      if (overviewWikitext) {
        const wikiIcons = extractIconsFromOverview(overviewWikitext, pageTitle);

        if (wikiIcons.length > 0) {
          const dbOrigins = await prisma.origin.findMany({
            where: {
              wiki_icon_name: {
                in: wikiIcons,
              },
            },
            select: { id: true },
          });
          originIds = dbOrigins.map((o) => o.id);
          console.log(`Gemappte Origin-IDs aus der DB:`, originIds);
        }
      }
    } catch (overviewError) {
      console.error(
        "Fehler beim Laden/Parsen der Übersichtsseite. Fahre ohne Origins fort:",
        overviewError,
      );
    }

    const parsedAnimal = parseAnimalData(wikiJson, originIds);

    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Fehler beim Parsen der Daten für ${pageTitle}` },
        { status: 500 },
      );
    }

    let biome = null;

    if (parsedAnimal.wikiBiomeName) {
      biome = await prisma.biome.findFirst({
        where: {
          identifier: parsedAnimal.wikiBiomeName,
        },
      });
    }

    if (!biome && parsedAnimal.wikiBiomeName) {
      biome = await prisma.biome.create({
        data: {
          identifier: parsedAnimal.wikiBiomeName,
        },
      });
    }

    const finalAnimalData = {
      ...parsedAnimal,
      biomeId: biome ? biome.id : 1,
    };

    const newAnimal = await createAnimal(finalAnimalData);

    const createdCoats = [];
    if (parsedAnimal.rawColorVariants && parsedAnimal.rawColorVariants.length > 0) {
      for (const variant of parsedAnimal.rawColorVariants) {
        const dbOrigins = await prisma.origin.findMany({
          where: {
            origintext: {
              some: {
                originName: { in: variant.obtainedFrom },
              },
            },
          },
          select: { id: true },
        });

        const variantOriginIds = dbOrigins.map((o) => o.id);

        const coatInput = {
          animalId: newAnimal.id,
          releaseDate: variant.releaseDate ? new Date(variant.releaseDate) : new Date(),
          image: variant.imageName || "",
          originIds: variantOriginIds,
          texts: [
            {
              languageCode: "en",
              name: variant.name,
              color: variant.color,
            },
          ],
        };

        const newCoat = await createSpecialCoat(coatInput);
        createdCoats.push(newCoat);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Tier '${pageTitle}' und ${createdCoats.length} Farbvarianten erfolgreich importiert.`,
      animal: newAnimal,
      coats: createdCoats,
      originIds,
    });
  } catch (error: any) {
    console.error("Import Fehler:", error);
    return NextResponse.json({ error: error.message || "Interner Serverfehler" }, { status: 500 });
  }
}
