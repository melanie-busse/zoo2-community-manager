/**
 * Import script for club contest data.
 * Run with: npx tsx prisma/import-contests.ts
 *
 * Reads contest data from prisma/contests.json and inserts into:
 *   - contest (startDate, endDate, active=0)
 *   - conteststatue (c1, c2, c3 → animalId per contest)
 *   - contestspecialcoat (c4 → specialCoatId per contest)
 *
 * Animals are looked up by English name (animaltext.languageCode = 'en').
 * Special coats are looked up by name + color (specialcoatstext.languageCode = 'en').
 *
 * Warnings are logged for any unresolved names — fix manually after import.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface ContestRow {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  c1: string | null;
  c2: string | null;
  c3: string | null;
  c4: string | null; // special coat "Name (Color)" or null
}

/** Strip trailing "(Color)" annotation from an animal name, e.g. "Rabbit (Spotted)" → "Rabbit" */
function stripParenthetical(name: string): string {
  return name.replace(/\s*\([^)]+\)\s*$/, "").trim();
}

/** Parse a special coat string into { name, color }.
 *  "Musk Deer (Gold)"          → { name: "Musk Deer", color: "Gold" }
 *  "Reticulated Giraffe (Black)" → { name: "Reticulated Giraffe", color: "Black" }
 *  "Green Anaconda"              → { name: "Green Anaconda", color: "" }
 */
function parseSpecialCoat(s: string): { name: string; color: string } {
  const m = s.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m) return { name: m[1].trim(), color: m[2].trim() };
  return { name: s.trim(), color: "" };
}

async function main() {
  const jsonPath = path.join(__dirname, "contests.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("ERROR: contests.json not found at", jsonPath);
    console.error("Run the Python parser first to generate this file.");
    process.exit(1);
  }

  const contests: ContestRow[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(`Loaded ${contests.length} contest rows from contests.json`);

  // Build animal lookup: lowercase name → animalId
  const animalTexts = await prisma.animalText.findMany({
    where: { languageCode: "en" },
    select: { animalName: true, animalId: true },
  });
  const animalMap = new Map<string, number>();
  for (const at of animalTexts) {
    animalMap.set(at.animalName.toLowerCase(), at.animalId);
  }
  console.log(`Loaded ${animalMap.size} animal names`);

  // Build special coat lookup: "lowercase name|lowercase color" → specialCoatId
  const coatTexts = await (prisma as any).specialCoatsText.findMany({
    where: { languageCode: "en" },
    select: { name: true, color: true, specialCoatId: true },
  }) as { name: string; color: string; specialCoatId: number }[];
  const coatMap = new Map<string, number>();
  for (const ct of coatTexts) {
    const key = `${ct.name.toLowerCase()}|${ct.color.toLowerCase()}`;
    coatMap.set(key, ct.specialCoatId);
  }
  console.log(`Loaded ${coatMap.size} special coat entries`);

  // Animal name aliases: PDF name → DB name
  const ANIMAL_ALIASES: Record<string, string> = {
    "goat": "Domestic Goat",
    "ostrich": "Common Ostrich",
    "tortoise": "Giant Tortoise",
    "giraffe": "Reticulated Giraffe",
    "pigeon": "Western Crowned Pigeon",
    "rhinoceros": "White Rhinoceros",
    "elephant": "African Elephant",
    "panda": "Giant Panda",
    "anaconda": "Green Anaconda",
    "bison": "American Bison",
    "secretary bird": "Secretarybird",
    "secretarybird": "Secretarybird",
  };

  // Special coat name aliases: normalized "name|color" → specialCoatId
  const COAT_ALIASES: Record<string, number> = {};
  // "Rabbit (Spotted)" → name="Hare", color="spotted"
  const hareSpotted = coatMap.get("hare|spotted");
  if (hareSpotted) COAT_ALIASES["rabbit|spotted"] = hareSpotted;
  // "Goodfellow Tree Kangaroo (Lumholtz)" → "Goodfellow's tree kangaroo|Lumholtz"
  const goodfellow = coatMap.get("goodfellow's tree kangaroo|lumholtz");
  if (goodfellow) COAT_ALIASES["goodfellow tree kangaroo|lumholtz"] = goodfellow;
  // "Oryx (Arabian)" → "Oryx antelope|Arabian"
  const oryx = coatMap.get("oryx antelope|arabian");
  if (oryx) COAT_ALIASES["oryx|arabian"] = oryx;
  // "Dwarf Hamster (white)" → case-insensitive
  const hamster = coatMap.get("dwarf hamster|white");
  if (hamster) COAT_ALIASES["dwarf hamster|white"] = hamster;

  function lookupAnimal(rawName: string | null): number | null {
    if (!rawName) return null;

    // Strip "ADVERTISEMENT" and other junk
    const cleaned = rawName.replace(/\bADVERTISEMENT\b/g, "").trim();
    if (!cleaned) return null;

    // Try exact name first
    let id = animalMap.get(cleaned.toLowerCase());
    if (id) return id;

    // Try stripping parenthetical (e.g. "Rabbit (Spotted)" → "Rabbit")
    const stripped = stripParenthetical(cleaned);
    if (stripped !== cleaned) {
      id = animalMap.get(stripped.toLowerCase());
      if (id) return id;
    }

    // Try alias lookup
    const aliasName = ANIMAL_ALIASES[cleaned.toLowerCase()] || ANIMAL_ALIASES[stripped.toLowerCase()];
    if (aliasName) {
      id = animalMap.get(aliasName.toLowerCase());
      if (id) return id;
    }

    return null;
  }

  function lookupSpecialCoat(rawName: string | null): number | null {
    if (!rawName) return null;
    const { name, color } = parseSpecialCoat(rawName);

    // Try alias lookup first
    const aliasKey = `${name.toLowerCase()}|${color.toLowerCase()}`;
    const aliasId = COAT_ALIASES[aliasKey];
    if (aliasId) return aliasId;

    // Try exact name + color
    let key = `${name.toLowerCase()}|${color.toLowerCase()}`;
    let id = coatMap.get(key);
    if (id) return id;

    // Try name only (color = "")
    key = `${name.toLowerCase()}|`;
    id = coatMap.get(key);
    if (id) return id;

    return null;
  }

  let inserted = 0;
  let skipped = 0;
  const warnings: string[] = [];

  for (const row of contests) {
    const startDate = new Date(row.startDate);
    const endDate = new Date(row.endDate);

    // Skip future/incomplete rows (no animals at all)
    if (!row.c1 && !row.c2 && !row.c3 && !row.c4) {
      skipped++;
      continue;
    }

    // Create contest
    const contest = await prisma.contest.create({
      data: {
        startDate,
        endDate,
        active: 0,
      },
    });

    // Resolve animals for c1, c2, c3
    const animalSlots = [
      { slot: "c1", raw: row.c1 },
      { slot: "c2", raw: row.c2 },
      { slot: "c3", raw: row.c3 },
    ];

    for (const { slot, raw } of animalSlots) {
      if (!raw) continue;
      const animalId = lookupAnimal(raw);
      if (!animalId) {
        warnings.push(`[${row.startDate}] ${slot}="${raw}" — animal not found, skipping`);
        continue;
      }
      await prisma.contestStatue.create({
        data: { contestId: contest.id, animalId },
      });
    }

    // Resolve special coat for c4
    if (row.c4) {
      const specialCoatId = lookupSpecialCoat(row.c4);
      if (!specialCoatId) {
        warnings.push(`[${row.startDate}] c4="${row.c4}" — special coat not found, skipping`);
      } else {
        await (prisma as any).contestSpecialCoat.create({
          data: { contestId: contest.id, specialCoatId },
        });
      }
    }

    inserted++;
  }

  console.log(`\nDone. Inserted ${inserted} contests, skipped ${skipped}.`);

  if (warnings.length > 0) {
    console.log(`\nWARNINGS (${warnings.length} unresolved entries):`);
    for (const w of warnings) console.log(" ", w);
  } else {
    console.log("No warnings — all entries resolved.");
  }
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => (prisma as any).$disconnect());
