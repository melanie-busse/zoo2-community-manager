import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAnimalDetails, parseAnimalData, extractIconsFromOverview } from "@/service/FandomApi";
import { createAnimal, updateAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";

async function resolveOriginIds(pageTitle: string): Promise<number[]> {
  try {
    const overviewPage = await fetchAnimalDetails("Animals");
    const overviewWikitext = overviewPage?.wikitext?.["*"] || "";
    if (!overviewWikitext) return [];

    const wikiIcons = extractIconsFromOverview(overviewWikitext, pageTitle);
    if (wikiIcons.length === 0) return [];

    const dbOrigins = await prisma.origin.findMany({
      where: { wiki_icon_name: { in: wikiIcons } },
      select: { id: true },
    });
    return dbOrigins.map((o) => o.id);
  } catch {
    console.error("Fehler beim Laden der Übersichtsseite. Fahre ohne Origins fort.");
    return [];
  }
}

async function resolveBiome(biomeName: string | null | undefined) {
  if (!biomeName) return null;
  const existing = await prisma.biome.findFirst({ where: { identifier: biomeName } });
  if (existing) return existing;
  return prisma.biome.create({ data: { identifier: biomeName } });
}

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

    const originIds = await resolveOriginIds(pageTitle);
    const parsedAnimal = parseAnimalData(wikiJson, originIds);

    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Fehler beim Parsen der Daten für ${pageTitle}` },
        { status: 500 },
      );
    }

    const biome = await resolveBiome(parsedAnimal.wikiBiomeName);
    const newAnimal = await createAnimal({ ...parsedAnimal, biomeId: biome ? biome.id : 1 });

    const createdCoats = [];
    if (parsedAnimal.rawColorVariants && parsedAnimal.rawColorVariants.length > 0) {
      for (const variant of parsedAnimal.rawColorVariants) {
        const dbOrigins = await prisma.origin.findMany({
          where: { origintext: { some: { originName: { in: variant.obtainedFrom } } } },
          select: { id: true },
        });

        const newCoat = await createSpecialCoat({
          animalId: newAnimal.id,
          releaseDate: variant.releaseDate ? new Date(variant.releaseDate) : new Date(),
          image: variant.imageName || "",
          originIds: dbOrigins.map((o) => o.id),
          texts: [{ languageCode: "en", name: variant.name, color: variant.color }],
        });
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

export async function PUT(request: Request) {
  try {
    const { pageTitle } = await request.json();

    if (!pageTitle) {
      return NextResponse.json({ error: "pageTitle ist erforderlich" }, { status: 400 });
    }

    // 1. Tier per englischem Namen in der DB suchen, um die ID und bestehende Daten zu holen
    const existingText = await prisma.animalText.findFirst({
      where: { animalName: pageTitle, languageCode: "en" },
    });

    if (!existingText) {
      return NextResponse.json(
        { error: `Tier '${pageTitle}' nicht in der DB gefunden` },
        { status: 404 },
      );
    }

    // Wir holen das komplette bestehende Tier aus der DB, um Bild und Gehege zu prüfen
    const existingAnimal = await prisma.animal.findUnique({
      where: { id: existingText.animalId },
    });

    const wikiJson = await fetchAnimalDetails(pageTitle);
    if (!wikiJson) {
      return NextResponse.json(
        { error: `Keine Wiki-Daten für ${pageTitle} gefunden` },
        { status: 404 },
      );
    }

    const originIds = await resolveOriginIds(pageTitle);
    const parsedAnimal = parseAnimalData(wikiJson, originIds);

    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Fehler beim Parsen der Daten für ${pageTitle}` },
        { status: 500 },
      );
    }

    // =========================================================================
    // SPERRE 1: Vorhandene Übersetzungen aus der DB schützen
    // =========================================================================
    const dbTexts = await prisma.animalText.findMany({
      where: { animalId: existingText.animalId },
    });

    for (const textEntry of parsedAnimal.animaltext) {
      const dbLangText = dbTexts.find((t) => t.languageCode === textEntry.languageCode);
      if (dbLangText) {
        textEntry.animalName = dbLangText.animalName;
        textEntry.animalDescription = dbLangText.animalDescription ?? "";
      }
    }

    // =========================================================================
    // SPERRE 2: Bild und Gehege (Biome) schützen
    // =========================================================================

    // Falls in der DB bereits ein Bildpfad hinterlegt ist, behalten wir diesen bei
    // und ignorieren den (eventuell abweichenden oder leeren) Wert aus dem Fandom-Parser.
    if (existingAnimal && existingAnimal.image) {
      parsedAnimal.imageName = existingAnimal.image;
    }

    // Gehege-Auflösung:
    // Wenn in der DB bereits ein gültiges Gehege (biomeId) eingetragen ist, das NICHT das Standardgehege (z.B. ID 1) ist,
    // behalten wir dieses bei und überspringen die Zuordnung aus dem Wiki.
    let finalBiomeId: number | undefined;

    if (existingAnimal && existingAnimal.biomeId && existingAnimal.biomeId !== 1) {
      finalBiomeId = existingAnimal.biomeId;
    } else {
      // Andernfalls (wenn noch das Standardgehege drin ist oder kein Tier gefunden wurde)
      // lösen wir das Gehege ganz normal über den Wiki-Namen auf.
      const biome = await resolveBiome(parsedAnimal.wikiBiomeName);
      finalBiomeId = biome ? biome.id : undefined;
    }
    // =========================================================================

    // Der Service bekommt nun das absolut sichere Objekt übergeben.
    const updatedAnimal = await updateAnimal(existingText.animalId, {
      ...parsedAnimal,
      biomeId: finalBiomeId,
    });

    return NextResponse.json({
      success: true,
      message: `Tier '${pageTitle}' erfolgreich aktualisiert (Bilder, Gehege und Übersetzungen wurden geschützt).`,
      animal: updatedAnimal,
      originIds,
    });
  } catch (error: any) {
    console.error("Update Fehler:", error);
    return NextResponse.json({ error: error.message || "Interner Serverfehler" }, { status: 500 });
  }
}
