import { readFileSync, writeFileSync } from "fs";

const sql = readFileSync("C:/Users/micro/Downloads/animaltext.sql", "utf8");

// Extract all INSERT rows
const rowRegex =
  /\((\d+),\s*(\d+),\s*'(\w+)',\s*'((?:[^'\\]|\\.|'')*)',\s*(?:'((?:[^'\\]|\\.|'')*)'|NULL)\)/g;

const byAnimal = {}; // animalId -> { languageCode -> { id, name, desc } }

let m;
while ((m = rowRegex.exec(sql)) !== null) {
  const [, id, animalId, lang, name, desc] = m;
  if (!byAnimal[animalId]) byAnimal[animalId] = {};
  byAnimal[animalId][lang] = { id: parseInt(id), name, desc: desc ?? "" };
}

const EXPECTED_LANGS = ["de", "en", "da", "nl", "fr", "es"];

// Find animals with missing languages, skipping placeholders
const missing = []; // { animalId, lang, sourceLang, name, desc }

for (const [animalId, langs] of Object.entries(byAnimal)) {
  const missingLangs = EXPECTED_LANGS.filter((l) => !langs[l]);
  if (missingLangs.length === 0) continue;

  // Prefer 'de' as source, fall back to 'en'
  const source = langs["de"] || langs["en"];
  if (!source) continue;

  // Skip placeholders
  const lowerName = source.name.toLowerCase();
  if (
    lowerName.includes("template") ||
    lowerName === "" ||
    source.desc === ""
  )
    continue;

  for (const lang of missingLangs) {
    missing.push({ animalId, lang, source });
  }
}

// Find max existing ID
let maxId = 0;
for (const langs of Object.values(byAnimal)) {
  for (const entry of Object.values(langs)) {
    if (entry.id > maxId) maxId = entry.id;
  }
}

let nextId = maxId + 1;

// Generate INSERT statements
const escSql = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

let output = `-- Missing animaltext translations
-- Generated: ${new Date().toISOString()}
-- Total missing entries: ${missing.length}
-- ID range starts at: ${nextId}
--
-- Animals with missing translations (animalId: missing languages):
`;

// Summary
const summaryMap = {};
for (const { animalId, lang, source } of missing) {
  if (!summaryMap[animalId]) summaryMap[animalId] = { langs: [], name: source.name };
  summaryMap[animalId].langs.push(lang);
}
for (const [animalId, { langs, name }] of Object.entries(summaryMap)) {
  output += `-- Animal ${animalId} (${name}): missing ${langs.join(", ")}\n`;
}

output += `\nSET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\nSET time_zone = "+00:00";\n\n`;
output += `INSERT INTO \`animaltext\` (\`id\`, \`animalId\`, \`languageCode\`, \`animalName\`, \`animalDescription\`) VALUES\n`;

const rows = missing.map(({ animalId, lang, source }) => {
  const id = nextId++;
  return `(${id}, ${animalId}, '${lang}', '${escSql(source.name)}', '${escSql(source.desc)}')`;
});

output += rows.join(",\n") + ";\n\nCOMMIT;\n";

writeFileSync("C:/Users/micro/Downloads/animaltext_missing.sql", output, "utf8");

console.log(`Done. ${missing.length} missing entries written.`);
console.log("Animals affected:", Object.keys(summaryMap).length);
console.log("ID range:", maxId + 1, "to", nextId - 1);
