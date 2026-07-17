import { parseBackendDate } from "@/utils/DateUtil";

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

    if (!response.ok) throw new Error(`Fandom API Details-Error: ${response.status}`);

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

/**
 * Extrahiert die echte Beschreibung aus dem == Description == Abschnitt
 * Jetzt fehlertolerant ohne harten Doppelpunkt-Zwang
 */
function extractDescription(wikitext: string): string {
  const descRegex = /==\s*Description\s*:?\s*==\s*\n([\s\S]*?)(?===\s*|$)/i;
  const match = wikitext.match(descRegex);

  if (match && match[1]) {
    return match[1].replace(/<[^>]*>/g, "").replace(/\[\[([^\]|]*)\|?([^\]]*)\]\]/g, "$2");
  }
  return "";
}

/**
 * Parsed die Tabelle für Gehegegrößen
 */
function extractEnclosureSizes(wikitext: string) {
  const sizes: { animalCount: number; size: number }[] = [];
  const tableBlockRegex = /==\s*Number of animals per enclosure\s*==[\s\S]*?\{\|([\s\S]*?)\|\}/i;
  const match = wikitext.match(tableBlockRegex);

  if (match && match[1]) {
    const rows = match[1].split(/\|-/);
    rows.forEach((row) => {
      const values = row.match(/\|\s*(\d+)\s*\n\|\s*(\d+)/);
      if (values) {
        sizes.push({
          animalCount: parseInt(values[1], 10),
          size: parseInt(values[2], 10),
        });
      }
    });
  }
  return sizes;
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

/**
 * Holt alle Farbvarianten inkl. Herkunfts-Array und Release-Datum
 */
function extractSpecialCoats(name: string, wikitext: string) {
  const specialCoats: {
    origin: string[];
    releaseDate: string | null;
    texts: { languageCode: string; name: string; color: string }[];
  }[] = [];

  const coatBoxRegex = /\{\{Coat_Box[\s\S]*?\}\}/g;
  const matches = wikitext.match(coatBoxRegex);

  if (matches) {
    for (const box of matches) {
      const colorMatch = box.match(/\|\s*row1\s*=\s*([^\|\}\n]+)/);

      if (!colorMatch?.[1]) continue;

      const originMatch = box.match(/\|\s*obtained_from\s*=\s*([^\|\}\n]+)/);
      const releaseMatch = box.match(/\|\s*release_date\s*=\s*([^\|\}\n]+)/);

      const rawOrigin = originMatch?.[1] ?? "";
      const originList = rawOrigin
        ? [...rawOrigin.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1].trim())
        : [];
      if (originList.length === 0 && rawOrigin.trim()) {
        originList.push(rawOrigin.replace(/[\[\]]/g, "").trim());
      }

      specialCoats.push({
        origin: originList,
        releaseDate: releaseMatch?.[1]?.trim() ?? null,
        texts: [{ languageCode: "en", name, color: colorMatch[1].trim() }],
      });
    }
  }
  return specialCoats;
}

/**
 * Holt die Daten der BaseTabelle
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
 * Sucht auf der Übersichtsseite nach dem Tiernamen und extrahiert alle direkt dahinterliegenden Icons.
 * Liefert z.B. ["Shop_Icon.png", "Epic_Icon_E.png"]
 */
export function extractIconsFromOverview(overviewWikitext: string, animalName: string): string[] {
  // Findet die gesamte Zeile, die [[AnimalName]] oder [[DisplayName|AnimalName]] enthält.
  // Behandelt auch Alias-Links wie [[Komodo dragon|Komodo Dragon]] oder [[Bat-eared Fox|Bat-Eared Fox]].
  const escapedName = animalName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `^[^\\n]*\\[\\[(?:[^|\\]]+\\|)?${escapedName}(?:\\|[^\\]]+)?\\][^\\n]*$`,
    "im",
  );
  const lineMatch = overviewWikitext.match(regex);

  const foundIcons: string[] = [];

  if (lineMatch && lineMatch[0]) {
    // Extrahiert alle [[File:Dateiname.png|...]] aus der gefundenen Zeile
    const fileRegex = /\[\[File:\s*([^|\]\n]+)/gi;
    let fileMatch;

    while ((fileMatch = fileRegex.exec(lineMatch[0])) !== null) {
      // Leerzeichen werden durch Unterstriche ersetzt, damit es genau auf die DB-Einträge matched
      const fileName = fileMatch[1].trim().replace(/ /g, "_");
      foundIcons.push(fileName);
    }
  }

  return foundIcons;
}

/**
 * Verarbeitet das Fandom-Ergebnis.
 * @param apiResult Das JSON von der API
 * @param originIds Optionale IDs der Herkunft, die du von der Übersichtsseite ausliest
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
