import wtf from "wtf_wikipedia";

import { parseBackendDate } from "@/utils/DateUtil";
import prisma from "@/lib/prisma";

const FANDOM_API_URL = "https://zoo2animalpark.fandom.com/api.php";

interface WikiCategoryMember {
  pageid: number;
  ns: number;
  title: string;
}

export async function fetchPagesFromCategory(categoryName: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: `Category:${categoryName}`,
    cmlimit: "max",
    format: "json",
    origin: "*",
  });

  try {
    const response = await fetch(`${FANDOM_API_URL}?${params.toString()}`);

    if (!response.ok)
      throw new Error(`The Fandom API responded with the status: ${response.status}`);

    const data = await response.json();

    return (
      data.query?.categorymembers
        ?.filter((member: WikiCategoryMember) => member.ns === 0 && member.title !== "Animals")
        .map((member: WikiCategoryMember) => member.title) || []
    );
  } catch (error) {
    console.error(`Error loading the category "${categoryName}":`, error);
    return [];
  }
}

export async function fetchAnimalDetails(pageTitle: string): Promise<any> {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    prop: "wikitext",
    format: "json",
    origin: "*",
  });

  try {
    const response = await fetch(`${FANDOM_API_URL}?${params.toString()}`);

    if (!response.ok) throw new Error(`Fandom API details error: ${response.status}`);

    const data = await response.json();

    return data.parse || null;
  } catch (error) {
    console.error(`Error loading details for "${pageTitle}":`, error);
    return null;
  }
}

function extractValue(wikitext: string, key: string): string | null {
  const regex = new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\|\\}\\n]+)`);
  const match = wikitext.match(regex);
  return match && match[1] ? match[1].trim() : null;
}

function extractDescription(wikitext: string): string {
  const section = wtf(wikitext).section("Description");
  return section ? section.text({}).trim() : "";
}

function extractEnclosureSizes(wikitext: string): { animalCount: number; size: number }[] {
  const section = wtf(wikitext).section("Number of animals per enclosure");
  if (!section) return [];

  const rawTables = section.tables() as any;
  const tables: any[] = Array.isArray(rawTables) ? rawTables : rawTables ? [rawTables] : [];
  if (tables.length === 0) return [];

  const rows: Record<string, { text: string }>[] = tables[0].json({}) ?? [];

  return rows
    .map((row) => {
      const values = Object.values(row);
      const animalCount = parseInt(values[0]?.text ?? "", 10);
      const size = parseInt(values[1]?.text ?? "", 10);
      return isNaN(animalCount) || isNaN(size) ? null : { animalCount, size };
    })
    .filter((row): row is { animalCount: number; size: number } => row !== null);
}

function durationToMinutes(durationStr: string): number {
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/);
  const minutesMatch = durationStr.match(/(\d+)\s*m/);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
  if (!hoursMatch && !minutesMatch) {
    const pureNumber = parseInt(durationStr, 10);
    if (!isNaN(pureNumber)) return pureNumber * 60;
  }
  return totalMinutes;
}

function parseInteractionForService(rawStyle: string | null) {
  if (!rawStyle) return { xp: 0, durationHours: 0, durationMinutes: 0 };

  const xp = parseInt((rawStyle.match(/^(\d+)/) || ["0", "0"])[1], 10);
  const hours = parseInt((rawStyle.match(/(\d+)\s*h/) || ["0", "0"])[1], 10);
  const minutes = parseInt((rawStyle.match(/(\d+)\s*m/) || ["0", "0"])[1], 10);

  return { xp, durationHours: hours, durationMinutes: minutes };
}

function extractSpecialCoats(
  name: string,
  wikitext: string,
): {
  origin: string[];
  releaseDate: string | null;
  texts: { languageCode: string; name: string; color: string }[];
}[] {
  const templates = wtf(wikitext).templates() as any[];

  return templates
    .map((t) => t.json() as Record<string, string>)
    .filter((params) => params.template === "coat box")
    .flatMap((params) => {
      const color = params.row1?.trim();
      if (!color) return [];

      // wtf_wikipedia resolves wiki links to plain text; split on commas for multiple sources
      const rawOrigin = params.obtained_from?.trim() ?? "";
      const originList = rawOrigin ? rawOrigin.split(/\s*,\s*/).filter(Boolean) : [];

      return [
        {
          origin: originList,
          releaseDate: params.release_date?.trim() ?? null,
          texts: [{ languageCode: "en", name, color }],
        },
      ];
    });
}

/**
 * Extracts base values (popularity, selling price, release XP) from the base stats table.
 */
function extractBaseTableValues(wikitext: string) {
  const tableRegex = /\|\s*1\s*\n\|\s*([\d,]+)\s*\n\|\s*([\d,]+)\s*\n\|\s*([\d,]+)/;
  const match = wikitext.match(tableRegex);
  return match
    ? {
        basePopularity: parseInt(match[1].replace(/,/g, ""), 10),
        baseSellingPrice: parseInt(match[2].replace(/,/g, ""), 10),
        baseReleaseXp: parseInt(match[3].replace(/,/g, ""), 10),
      }
    : { basePopularity: 0, baseSellingPrice: 0, baseReleaseXp: 0 };
}

/**
 * Finds the line for the given animal on the overview page and extracts all icons immediately following it.
 * Returns e.g. ["Shop_Icon.png", "Epic_Icon_E.png"]
 */
export function extractIconsFromOverview(overviewWikitext: string, animalName: string): string[] {
  // Matches the full line containing [[AnimalName]] or [[DisplayName|AnimalName]].
  // Also handles alias links like [[Komodo dragon|Komodo Dragon]] or [[Bat-eared Fox|Bat-Eared Fox]].
  const escapedName = animalName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `^[^\\n]*\\[\\[(?:[^|\\]]+\\|)?${escapedName}(?:\\|[^\\]]+)?\\][^\\n]*$`,
    "im",
  );
  const lineMatch = overviewWikitext.match(regex);

  const foundIcons: string[] = [];

  if (lineMatch && lineMatch[0]) {
    // Extracts all [[File:filename.png|...]] occurrences from the matched line
    const fileRegex = /\[\[File:\s*([^|\]\n]+)/gi;
    let fileMatch;

    while ((fileMatch = fileRegex.exec(lineMatch[0])) !== null) {
      // Replace spaces with underscores to match the DB entries exactly
      const fileName = fileMatch[1].trim().replace(/ /g, "_");
      foundIcons.push(fileName);
    }
  }

  return foundIcons;
}

/**
 * Parses the Fandom API result into a structured animal object.
 * @param apiResult The JSON returned by the API
 * @param originIds Optional origin IDs resolved from the overview page
 */
export function parseAnimalData(apiResult: any, originIds: number[] = []) {
  const wikitext = apiResult.wikitext?.["*"];
  if (!wikitext) return null;

  const rawPriceString = extractValue(wikitext, "price") || "";
  let price = 0;
  let currencyId = 1;
  const priceNumberMatch = rawPriceString.match(/^([\d,]+)/);
  if (priceNumberMatch) price = parseInt(priceNumberMatch[1].replace(/,/g, ""), 10);
  if (rawPriceString.toLowerCase().includes("d.png")) currencyId = 2;

  const breedingCost = parseInt((extractValue(wikitext, "cost") || "0").replace(/,/g, ""), 10);
  const breedingDuration = durationToMinutes(extractValue(wikitext, "duration") || "0h");
  const breedingProbability = parseInt(
    (extractValue(wikitext, "probability") || "0%").replace("%", ""),
    10,
  );
  const breedingLevel = parseInt(extractValue(wikitext, "shelter_level") || "0", 10);

  const feedAction = parseInteractionForService(extractValue(wikitext, "feeding"));
  const playAction = parseInteractionForService(extractValue(wikitext, "playing"));
  const cleanAction = parseInteractionForService(extractValue(wikitext, "cleaning"));

  const tableValues = extractBaseTableValues(wikitext);
  const enclosureSizes = extractEnclosureSizes(wikitext);
  const description = extractDescription(wikitext);
  const releaseDate = extractValue(wikitext, "release_date");
  const biomeName = extractValue(wikitext, "biome");

  const specialCoats = extractSpecialCoats(apiResult.title, wikitext);

  return {
    price,
    currencyId,
    releaseDate: parseBackendDate(releaseDate),
    sellingPrice: tableValues.baseSellingPrice,
    popularity: tableValues.basePopularity,
    releaseExp: tableValues.baseReleaseXp,
    breedingLevel,
    breedingCost,
    breedingDuration,
    breedingProbability,

    wikiBiomeName: biomeName,

    animaltext: [
      {
        languageCode: "en",
        animalName: apiResult.title,
        animalDescription: description,
      },
    ],

    actions: {
      feed: feedAction,
      play: playAction,
      clean: cleanAction,
    },

    enclosureSizes,
    origins: originIds.map((id) => ({ id })),
    specialCoats,
  };
}

function parseChanceToNumber(rawChance: string | null | undefined): number {
  if (!rawChance || rawChance.trim() === "-" || rawChance.trim() === "0%") {
    return 0;
  }
  return parseFloat(rawChance.replace("%", "").trim()) || 0;
}

function parseParentNeeded(rawText: string | null | undefined): boolean {
  if (!rawText) return false;
  return rawText.toLowerCase().trim().includes("yes");
}

export async function syncBreedingChancesFromApi(): Promise<void> {
  const pageData = await fetchAnimalDetails("Special_Coats");
  const wikitext = pageData?.wikitext?.["*"];
  if (!wikitext) throw new Error("Could not load the wikitext of the Special_Coats page.");

  const rawTables = wtf(wikitext).tables() as any;
  const tables: any[] = Array.isArray(rawTables) ? rawTables : rawTables ? [rawTables] : [];
  if (tables.length === 0) throw new Error("No table found on the Special_Coats page.");

  // Columns: Animal | Coat | Obtained from | Parent needed | Base (no parent) | Base (1 parent) | Event (no parent)
  const rows: Record<string, { text: string }>[] = tables[0].json({}) ?? [];
  let currentAnimalName = "";
  let updated = 0;

  for (const row of rows) {
    const cells = Object.values(row);
    if (cells.length < 6) continue;

    const rawAnimalName = cells[0]?.text?.trim() ?? "";
    const coatColor = cells[1]?.text?.trim() ?? "";
    // cells[2] = obtained from — no corresponding DB field exists
    const parentNeededText = cells[3]?.text?.trim() ?? "";
    const baseWithoutParent = cells[4]?.text?.trim() ?? "";
    const baseWithOneParent = cells[5]?.text?.trim() ?? "";
    const eventWithoutParent = cells[6]?.text?.trim() ?? "";

    if (rawAnimalName) currentAnimalName = rawAnimalName;
    if (!currentAnimalName || !coatColor || coatColor.toLowerCase().includes("special coat"))
      continue;

    const animalTextEntry = await prisma.animalText.findFirst({
      where: { animalName: currentAnimalName, languageCode: "en" },
      select: { animalId: true },
    });
    if (!animalTextEntry) continue;

    const coatTextEntry = await prisma.specialCoatsText.findFirst({
      where: {
        specialcoat: { animalId: animalTextEntry.animalId },
        color: coatColor,
        languageCode: "en",
      },
      select: { specialCoatId: true },
    });
    if (!coatTextEntry) continue;

    await prisma.specialCoat.update({
      where: { id: coatTextEntry.specialCoatId },
      data: {
        parentWithCoatNeeded: parseParentNeeded(parentNeededText),
        chanceBaseWithoutParent: parseChanceToNumber(baseWithoutParent),
        chanceBaseWithOneParent: parseChanceToNumber(baseWithOneParent),
        chanceEventWithoutParent: parseChanceToNumber(eventWithoutParent),
      },
    });

    console.log(`[API-Sync] ${currentAnimalName} – ${coatColor} updated.`);
    updated++;
  }

  console.log(`[API-Sync] ${updated} special coat(s) successfully synced.`);
}
