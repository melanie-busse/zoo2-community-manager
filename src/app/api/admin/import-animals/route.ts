import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  fetchAnimalDetails,
  parseAnimalData,
  extractIconsFromOverview,
} from "@/service/FandomService";
import { createAnimal, updateAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";
import { translateText } from "@/utils/translate";
import { getAllLanguages } from "@/service/LanguageService";
import { parseBackendDate } from "@/utils/DateUtil";

const delay = () => new Promise((r) => setTimeout(r, 400));

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
    console.error("Failed to load overview page. Continuing without origins.");
    return [];
  }
}

async function resolveBiome(biomeName: string | null | undefined) {
  if (!biomeName) return null;

  // Normalisierung: Kleinbuchstaben + Leerzeichen → Unterstriche
  const normalized = biomeName.toLowerCase().replace(/\s+/g, "_");
  // Kandidaten: Original, normalisiert, normalisiert ohne abschließendes 's' (z.B. "Grasslands" → "grassland")
  const candidates = [...new Set([biomeName, normalized, normalized.replace(/s$/, "")])];

  const existing = await prisma.biome.findFirst({ where: { identifier: { in: candidates } } });
  if (existing) return existing;

  return prisma.biome.create({ data: { identifier: normalized } });
}

function extractDescriptionFromWiki(wikiJson: any): string {
  const wikitext = wikiJson.wikitext?.["*"] || "";

  // Primär: Text nach {{AnimalInfo...}} vor dem ersten == Abschnitt
  const templateMatch = wikitext.match(
    /\{\{AnimalInfo[\s\S]*?\}\}\s*([\s\S]*?)(?===\s*Behavior\s*==|==\s*Breeding\s*==|\s*$)/i,
  );
  if (templateMatch?.[1]?.trim()) {
    return templateMatch[1]
      .replace(/\[\[.*?\|(.*?)\]\]/g, "$1")
      .replace(/\[\[(.*?)\]\]/g, "$1")
      .trim();
  }

  // Fallback: ==Description== Abschnitt (für {{Animal|...}} Einzeiler-Templates)
  const sectionMatch = wikitext.match(/==\s*Description\s*:?\s*==\s*\n([\s\S]*?)(?===|$)/i);
  if (sectionMatch?.[1]?.trim()) {
    return sectionMatch[1]
      .replace(/<[^>]*>/g, "")
      .replace(/\[\[([^\]|]*)\|?([^\]]*)\]\]/g, "$2")
      .trim();
  }

  return "";
}

type Language = { code: string };
type AnimalTextEntry = { languageCode: string; animalName: string; animalDescription: string };

async function buildAnimalTexts(
  name: string,
  englishDescription: string,
  dbLanguages: Language[],
  existingTexts: {
    languageCode: string;
    animalName: string;
    animalDescription: string | null;
  }[] = [],
  hasEnglishTextChanged = true,
): Promise<AnimalTextEntry[]> {
  const texts: AnimalTextEntry[] = [];

  for (const lang of dbLanguages) {
    if (lang.code === "en") {
      texts.push({ languageCode: "en", animalName: name, animalDescription: englishDescription });
      continue;
    }

    const existing = existingTexts.find((t) => t.languageCode === lang.code);
    if (existing && !hasEnglishTextChanged) {
      texts.push({
        languageCode: lang.code,
        animalName: existing.animalName,
        animalDescription: existing.animalDescription ?? "",
      });
      continue;
    }

    const translatedName = await translateText(name, lang.code);
    await delay();
    const translatedDesc = englishDescription
      ? await translateText(englishDescription, lang.code)
      : "";
    await delay();
    texts.push({
      languageCode: lang.code,
      animalName: translatedName,
      animalDescription: translatedDesc,
    });
  }

  return texts;
}

async function buildCoatTexts(
  enText: { languageCode: string; name: string; color: string },
  dbLanguages: Language[],
) {
  const texts = [];
  for (const lang of dbLanguages) {
    if (lang.code === "en") {
      texts.push(enText);
      continue;
    }
    const translatedName = await translateText(enText.name, lang.code);
    await delay();
    const translatedColor = await translateText(enText.color, lang.code);
    await delay();
    texts.push({ languageCode: lang.code, name: translatedName, color: translatedColor });
  }
  return texts;
}

async function resolveOriginIdsForCoat(wikiOrigins: string[]): Promise<number[]> {
  let dbOrigins = await prisma.origin.findMany({
    where: { origintext: { some: { originName: { in: wikiOrigins } } } },
    select: { id: true },
  });

  if (dbOrigins.length === 0 && wikiOrigins.length > 0) {
    const allOrigins = await prisma.origin.findMany({
      select: { id: true, origintext: { select: { originName: true } } },
    });
    dbOrigins = allOrigins.filter((o) =>
      o.origintext.some((ot) =>
        wikiOrigins.some(
          (wikiName) =>
            wikiName.toLowerCase().includes(ot.originName.toLowerCase()) ||
            ot.originName.toLowerCase().includes(wikiName.toLowerCase()),
        ),
      ),
    );
  }

  return dbOrigins.map((o) => o.id);
}

async function syncMissingCoats(
  animalId: number,
  wikiCoats: any[],
  dbLanguages: { code: string }[],
): Promise<any[]> {
  const existingCoats = await prisma.specialCoatsText.findMany({
    where: { specialcoat: { animalId }, languageCode: "en" },
    select: { color: true },
  });
  const existingColors = new Set(existingCoats.map((c) => c.color));

  const created = [];
  for (const coat of wikiCoats) {
    const color = coat.texts[0]?.color;
    if (!color || existingColors.has(color)) continue;

    try {
      const originIds = await resolveOriginIdsForCoat(coat.origin);
      const newCoat = await createSpecialCoat({
        animalId,
        releaseDate: parseBackendDate(coat.releaseDate) ?? new Date(),
        image: null,
        originIds,
        texts: await buildCoatTexts(coat.texts[0], dbLanguages),
      });
      created.push(newCoat);
      console.log(`[Import] Created missing special coat '${color}' for animal ${animalId}`);
    } catch (coatError: any) {
      console.error(`[Import] Failed to create special coat '${color}':`, coatError?.message ?? coatError);
    }
  }
  return created;
}

export async function POST(request: Request) {
  try {
    const { pageTitle } = await request.json();

    if (!pageTitle) {
      return NextResponse.json({ error: "pageTitle is required" }, { status: 400 });
    }

    const wikiJson = await fetchAnimalDetails(pageTitle);
    if (!wikiJson) {
      return NextResponse.json(
        { error: `No wiki data found for "${pageTitle}"` },
        { status: 404 },
      );
    }

    const originIds = await resolveOriginIds(pageTitle);
    const parsedAnimal = parseAnimalData(wikiJson, originIds);

    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Failed to parse wiki data for "${pageTitle}"` },
        { status: 500 },
      );
    }

    const dbLanguages = await getAllLanguages();
    const englishDescription = extractDescriptionFromWiki(wikiJson);

    parsedAnimal.animaltext = await buildAnimalTexts(pageTitle, englishDescription, dbLanguages);

    const biome = await resolveBiome(parsedAnimal.wikiBiomeName);
    const newAnimal = await createAnimal({ ...parsedAnimal, biomeId: biome ? biome.id : 1 });

    const createdCoats = await syncMissingCoats(newAnimal.id, parsedAnimal.specialCoats ?? [], dbLanguages);

    return NextResponse.json({
      success: true,
      message: `Animal '${pageTitle}' and ${createdCoats.length} special coat(s) successfully imported.`,
      animal: newAnimal,
      coats: createdCoats,
      originIds,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { pageTitle } = await request.json();

    if (!pageTitle) {
      return NextResponse.json({ error: "pageTitle is required" }, { status: 400 });
    }

    const existingText = await prisma.animalText.findFirst({
      where: { animalName: pageTitle, languageCode: "en" },
    });

    if (!existingText) {
      return NextResponse.json(
        { error: `Animal '${pageTitle}' not found in database` },
        { status: 404 },
      );
    }

    const existingAnimal = await prisma.animal.findUnique({ where: { id: existingText.animalId } });

    const wikiJson = await fetchAnimalDetails(pageTitle);
    if (!wikiJson) {
      return NextResponse.json(
        { error: `No wiki data found for "${pageTitle}"` },
        { status: 404 },
      );
    }

    const originIds = await resolveOriginIds(pageTitle);
    const parsedAnimal = parseAnimalData(wikiJson, originIds);

    if (!parsedAnimal) {
      return NextResponse.json(
        { error: `Failed to parse wiki data for "${pageTitle}"` },
        { status: 500 },
      );
    }

    const dbTexts = await prisma.animalText.findMany({
      where: { animalId: existingText.animalId },
    });
    const englishDescription = extractDescriptionFromWiki(wikiJson);
    const currentDbEnglishText =
      dbTexts.find((t) => t.languageCode === "en")?.animalDescription || "";
    const hasEnglishTextChanged = currentDbEnglishText.trim() !== englishDescription.trim();
    const dbLanguages = await getAllLanguages();

    parsedAnimal.animaltext = await buildAnimalTexts(pageTitle, englishDescription, dbLanguages, dbTexts, hasEnglishTextChanged);

    const biome =
      existingAnimal?.biomeId && existingAnimal.biomeId !== 1
        ? { id: existingAnimal.biomeId }
        : await resolveBiome(parsedAnimal.wikiBiomeName);

    const updatedAnimal = await updateAnimal(existingText.animalId, {
      ...parsedAnimal,
      biomeId: biome?.id,
      ...(existingAnimal?.image ? { imageName: existingAnimal.image } : {}),
    });

    const newCoats = await syncMissingCoats(
      existingText.animalId,
      parsedAnimal.specialCoats ?? [],
      dbLanguages,
    );

    return NextResponse.json({
      success: true,
      message: `Animal '${pageTitle}' successfully updated. ${newCoats.length} new special coat(s) added.`,
      animal: updatedAnimal,
      newCoats,
      originIds,
    });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
