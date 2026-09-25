/**
 * Translates missing animaltext entries using the Claude API.
 *
 * Prerequisites:
 *   set ANTHROPIC_API_KEY=sk-ant-...   (Windows)
 *   export ANTHROPIC_API_KEY=sk-ant-... (Linux/Mac)
 *
 * Usage:
 *   node scripts/translate_missing.mjs
 */

import { readFileSync, writeFileSync } from "fs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY is not set.");
  process.exit(1);
}

const LANG_NAMES = { nl: "Dutch", fr: "French", es: "Spanish" };

// Re-parse the original SQL dump to get proper source data
const sqlDump = readFileSync("C:/Users/micro/Downloads/animaltext.sql", "utf8");
const rowRegex =
  /\((\d+),\s*(\d+),\s*'(\w+)',\s*'((?:[^'\\]|\\.|'')*)',\s*(?:'((?:[^'\\]|\\.|'')*)'|NULL)\)/g;

const byAnimal = {};
let m;
while ((m = rowRegex.exec(sqlDump)) !== null) {
  const [, id, animalId, lang, name, desc] = m;
  if (!byAnimal[animalId]) byAnimal[animalId] = {};
  byAnimal[animalId][lang] = { id: parseInt(id), name, desc: desc ?? "" };
}

const EXPECTED_LANGS = ["de", "en", "da", "nl", "fr", "es"];

// Collect all missing entries
const missing = [];
for (const [animalId, langs] of Object.entries(byAnimal)) {
  const missingLangs = EXPECTED_LANGS.filter((l) => !langs[l]);
  if (missingLangs.length === 0) continue;

  const source = langs["de"] || langs["en"];
  if (!source) continue;

  const lowerName = source.name.toLowerCase();
  if (lowerName.includes("template") || lowerName === "" || source.desc === "") continue;

  for (const lang of missingLangs) {
    if (!LANG_NAMES[lang]) continue; // only translate nl, fr, es (da already exists for most)
    missing.push({ animalId, lang, source });
  }
}

console.log(`Total entries to translate: ${missing.length}`);

// Find max existing ID in dump
let maxId = 0;
for (const langs of Object.values(byAnimal)) {
  for (const entry of Object.values(langs)) {
    if (entry.id > maxId) maxId = entry.id;
  }
}
let nextId = maxId + 1;

// Helper: escape SQL string
const escSql = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

// Translate a batch of entries via Claude API
async function translateBatch(entries) {
  // Build a structured prompt
  const items = entries.map((e, i) => {
    const srcLang = e.source.lang === "en" ? "English" : "German";
    return `[${i}] Target: ${LANG_NAMES[e.lang]}\nName: ${e.source.name}\nDescription: ${e.source.desc}`;
  });

  const prompt = `You are a translator for a zoo game app. Translate each animal entry into the specified target language.
Keep the friendly, engaging zoo-guide tone. Keep animal names accurate (use the official common name in the target language).
Keep descriptions roughly the same length.

Respond with a JSON array where each element has: { "name": "...", "desc": "..." }
Return exactly ${entries.length} elements in the same order.

Entries to translate:
${items.join("\n\n")}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON array found in response: " + text.substring(0, 200));
  return JSON.parse(jsonMatch[0]);
}

// Process in batches
const BATCH_SIZE = 20;
const results = []; // { animalId, lang, name, desc }

for (let i = 0; i < missing.length; i += BATCH_SIZE) {
  const batch = missing.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;
  const totalBatches = Math.ceil(missing.length / BATCH_SIZE);
  process.stdout.write(`Batch ${batchNum}/${totalBatches}... `);

  let translations;
  let retries = 0;
  while (retries < 3) {
    try {
      translations = await translateBatch(batch);
      break;
    } catch (err) {
      retries++;
      console.error(`\nError (attempt ${retries}): ${err.message}`);
      if (retries >= 3) {
        console.error("Giving up on batch, using source text as fallback.");
        translations = batch.map((e) => ({ name: e.source.name, desc: e.source.desc }));
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  for (let j = 0; j < batch.length; j++) {
    results.push({
      animalId: batch[j].animalId,
      lang: batch[j].lang,
      name: translations[j]?.name ?? batch[j].source.name,
      desc: translations[j]?.desc ?? batch[j].source.desc,
    });
  }

  console.log("done");

  // Small delay to avoid rate limits
  if (i + BATCH_SIZE < missing.length) {
    await new Promise((r) => setTimeout(r, 300));
  }
}

// Also handle missing 'da' entries (translate from de/en)
const missingDa = [];
for (const [animalId, langs] of Object.entries(byAnimal)) {
  if (langs["da"]) continue;
  const source = langs["de"] || langs["en"];
  if (!source) continue;
  const lowerName = source.name.toLowerCase();
  if (lowerName.includes("template") || lowerName === "" || source.desc === "") continue;
  missingDa.push({ animalId, lang: "da", source });
}

if (missingDa.length > 0) {
  console.log(`\nAlso translating ${missingDa.length} missing Danish entries...`);
  for (let i = 0; i < missingDa.length; i += BATCH_SIZE) {
    const batch = missingDa.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(missingDa.length / BATCH_SIZE);
    process.stdout.write(`DA Batch ${batchNum}/${totalBatches}... `);
    let translations;
    try {
      translations = await translateBatch(batch);
    } catch (err) {
      translations = batch.map((e) => ({ name: e.source.name, desc: e.source.desc }));
    }
    for (let j = 0; j < batch.length; j++) {
      results.push({
        animalId: batch[j].animalId,
        lang: "da",
        name: translations[j]?.name ?? batch[j].source.name,
        desc: translations[j]?.desc ?? batch[j].source.desc,
      });
    }
    console.log("done");
    if (i + BATCH_SIZE < missingDa.length) await new Promise((r) => setTimeout(r, 300));
  }
}

// Write SQL output
let output = `-- Missing animaltext translations (machine-translated via Claude)
-- Generated: ${new Date().toISOString()}
-- Total entries: ${results.length}
-- ID range: ${nextId} to ${nextId + results.length - 1}

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

INSERT INTO \`animaltext\` (\`id\`, \`animalId\`, \`languageCode\`, \`animalName\`, \`animalDescription\`) VALUES
`;

const rows = results.map(({ animalId, lang, name, desc }) => {
  const id = nextId++;
  return `(${id}, ${animalId}, '${lang}', '${escSql(name)}', '${escSql(desc)}')`;
});

output += rows.join(",\n") + ";\n\nCOMMIT;\n";

const outPath = "C:/Users/micro/Downloads/animaltext_translated.sql";
writeFileSync(outPath, output, "utf8");

console.log(`\nDone! Written to: ${outPath}`);
console.log(`Total entries: ${results.length}, ID range: ${maxId + 1} – ${nextId - 1}`);
