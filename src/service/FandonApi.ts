const FANDOM_API_URL = "https://zoo2animalpark.fandom.com/api.php";

interface WikiCategoryMember {
  pageid: number;
  ns: number;
  title: string;
}

// ==========================================
// 1. API-ABFRAGEN (FETCH FUNCTIONS)
// ==========================================

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
    if (!response.ok) throw new Error(`Fandom API antwortete mit Status: ${response.status}`);
    const data = await response.json();
    return data.query?.categorymembers?.map((member: WikiCategoryMember) => member.title) || [];
  } catch (error) {
    console.error(`Fehler beim Laden der Kategorie "${categoryName}":`, error);
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
    if (!response.ok) throw new Error(`Fandom API Details-Fehler: ${response.status}`);
    const data = await response.json();
    return data.parse || null;
  } catch (error) {
    console.error(`Fehler beim Laden der Details für "${pageTitle}":`, error);
    return null;
  }
}

// ==========================================
// 2. EXTRAKTOR-HILFSFUNKTIONEN
// ==========================================

function extractValue(wikitext: string, key: string): string | null {
  const regex = new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\|\\}\\n]+)`);
  const match = wikitext.match(regex);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * Extrahiert die echte Beschreibung aus dem == Description == Abschnitt
 */
function extractDescription(wikitext: string): string {
  // Sucht nach == Description == oder == Description == (mit Non-breaking space)
  const descRegex = /==\s*Description\s*==\s*\n([\s\S]*?)(?===\s*|$)/i;
  const match = wikitext.match(descRegex);

  if (match && match[1]) {
    return match[1]
      .replace(/<[^>]*>/g, "") // HTML-Tags entfernen
      .replace(/\[\[([^\]|]*)\|?([^\]]*)\]\]/g, "$2") // Wiki-Links bereinigen
      .trim();
  }
  return "";
}

/**
 * Parsed die Tabelle für Gehegegrößen
 */
function extractEnclosureSizes(wikitext: string) {
  const sizes: { animalCount: number; size: number }[] = [];
  // Holt den Block zwischen der Überschrift und dem nächsten Abschnitt
  const tableBlockRegex = /==\s*Number of animals per enclosure\s*==[\s\S]*?\{\|([\s\S]*?)\|\}/i;
  const match = wikitext.match(tableBlockRegex);

  if (match && match[1]) {
    // Teilt die Zeilen nach dem Tabellen-Trennzeichen |-
    const rows = match[1].split(/\|-/);
    rows.forEach((row) => {
      // Sucht nach zwei aufeinanderfolgenden Werten wie | 1 \n | 9
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

  // Wenn match() fehlschlägt, nutzen wir ein String-Array als Fallback
  const xp = parseInt((rawStyle.match(/^(\d+)/) || ["0", "0"])[1], 10);
  const hours = parseInt((rawStyle.match(/(\d+)\s*h/) || ["0", "0"])[1], 10);
  const minutes = parseInt((rawStyle.match(/(\d+)\s*m/) || ["0", "0"])[1], 10);

  return { xp, durationHours: hours, durationMinutes: minutes };
}

/**
 * Holt alle Farbvarianten inkl. Herkunfts-Array und Release-Datum
 */
function extractColorVariants(wikitext: string) {
  const variants: {
    name: string;
    imageName: string | null;
    obtainedFrom: string[];
    releaseDate: string | null
  }[] = [];

  const coatBoxRegex = /\{\{Coat_Box[\s\S]*?\}\}/g;
  const matches = wikitext.match(coatBoxRegex);

  if (matches) {
    matches.forEach((box) => {
      const nameMatch = box.match(/\|\s*row1\s*=\s*([^\|\}\n]+)/);
      const imageMatch = box.match(/\|\s*image1\s*=\s*([^\|\}\n]+)/);
      const obtainedMatch = box.match(/\|\s*obtained_from\s*=\s*([^\|\}\n]+)/);
      const releaseMatch = box.match(/\|\s*release_date\s*=\s*([^\|\}\n]+)/);

      if (nameMatch && nameMatch[1]) {
        const obtainedList: string[] = [];

        if (obtainedMatch && obtainedMatch[1]) {
          const rawObtained = obtainedMatch[1];
          // Sucht nach allen Instanzen von [[Link-Name]] oder [[Link|Alternativtext]]
          const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
          let linkMatch;

          while ((linkMatch = linkRegex.exec(rawObtained)) !== null) {
            obtainedList.push(linkMatch[1].trim());
          }

          // Fallback: Falls keine Wiki-Links gefunden wurden, aber Text da steht (z.B. Plain Text)
          if (obtainedList.length === 0 && rawObtained.trim()) {
            obtainedList.push(rawObtained.replace(/[\[\]]/g, '').trim());
          }
        }

        variants.push({
          name: nameMatch[1].trim(),
          imageName: imageMatch && imageMatch[1] ? imageMatch[1].trim() : null,
          obtainedFrom: obtainedList, // Übergabe des Arrays
          releaseDate: releaseMatch && releaseMatch[1] ? releaseMatch[1].trim() : null
        });
      }
    });
  }
  return variants;
}

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

// ==========================================
// 3. HAUPTMETHODE FÜR DEN IMPORT
// ==========================================

/**
 * Verarbeitet das Fandom-Ergebnis.
 * @param apiResult Das JSON von der API
 * @param originIds Optionale IDs der Herkunft, die du von der Übersichtsseite ausliest
 */
export function parseAnimalData(apiResult: any, originIds: number[] = []) {
  const wikitext = apiResult.wikitext?.["*"];
  if (!wikitext) return null;

  // 1. Währung und Preis
  const rawPriceString = extractValue(wikitext, "price") || "";
  let price = 0;
  let currencyId = 1;
  const priceNumberMatch = rawPriceString.match(/^([\d,]+)/);
  if (priceNumberMatch) price = parseInt(priceNumberMatch[1].replace(/,/g, ""), 10);
  if (rawPriceString.toLowerCase().includes("d.png")) currencyId = 2;

  // 2. Zuchtdaten
  const breedingCost = parseInt((extractValue(wikitext, "cost") || "0").replace(/,/g, ""), 10);
  const breedingDuration = durationToMinutes(extractValue(wikitext, "duration") || "0h");
  const breedingProbability = parseInt(
    (extractValue(wikitext, "probability") || "0%").replace("%", ""),
    10,
  );
  const breedingLevel = parseInt(extractValue(wikitext, "shelter_level") || "0", 10);

  // 3. Interaktionen (Actions)
  const feedAction = parseInteractionForService(extractValue(wikitext, "feeding"));
  const playAction = parseInteractionForService(extractValue(wikitext, "playing"));
  const cleanAction = parseInteractionForService(extractValue(wikitext, "cleaning"));

  // 4. Tabellen- & Strukturdaten
  const tableValues = extractBaseTableValues(wikitext);
  const enclosureSizes = extractEnclosureSizes(wikitext);
  const description = extractDescription(wikitext);
  const releaseDate = extractValue(wikitext, "release_date");
  const biomeName = extractValue(wikitext, "biome");

  return {
    price,
    currencyId,
    releaseDate, // Wird an deinen Service gereicht und dort zu Date konvertiert
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
        animalDescription: description, // Hier sitzt jetzt die echte Beschreibung!
      },
    ],

    actions: {
      feed: feedAction,
      play: playAction,
      clean: cleanAction,
    },

    // Die geparste Gehege-Tabelle für tx.animalPerEnclosure.createMany
    enclosureSizes,

    // Die ermittelten Herkunfts-IDs von der Übersichtsseite
    origins: originIds.map((id) => ({ id })),

    // Angereicherte Farbvarianten für den nächsten Step
    rawColorVariants: extractColorVariants(wikitext),
    imageName: extractValue(wikitext, "image1"),
  };
}
