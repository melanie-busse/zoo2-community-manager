const fs = require("fs");
const deepl = require("deepl-node");

// Deinen DeepL API Key eintragen
const translator = new deepl.Translator("31d63917-cb3b-4e3e-a642-db22183eef5c:fx");

async function processSql() {
  const sqlContent = fs.readFileSync("animaltext.sql", "utf-8");

  // Regex um die VALUES-Zeilen zu matchen: (id, animalId, 'lang', 'Name', 'Beschreibung')
  const regex = /\((\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/g;

  let matches = [...sqlContent.matchAll(regex)];
  let newSqlContent = sqlContent;

  console.log(`Gefundene Einträge: ${matches.length}. Starte Übersetzung...`);

  for (const match of matches) {
    const [fullMatch, id, animalId, lang, name, desc] = match;

    // DeepL Sprach-Code mappen (z.B. nl, fr, es)
    const targetLang = lang.toLowerCase() === "en" ? "en-US" : lang.toLowerCase();

    try {
      const translatedName = await translator.translateText(name, "de", targetLang);
      const translatedDesc = await translator.translateText(desc, "de", targetLang);

      // Escapen von Hochkommas für SQL
      const cleanName = translatedName.text.replace(/'/g, "''");
      const cleanDesc = translatedDesc.text.replace(/'/g, "''");

      const newRow = `(${id}, ${animalId}, '${lang}', '${cleanName}', '${cleanDesc}')`;
      newSqlContent = newSqlContent.replace(fullMatch, newRow);

      console.log(`[${lang}] ${name} -> ${translatedName.text}`);
    } catch (err) {
      console.error(`Fehler bei ID ${id} (${lang}):`, err.message);
    }
  }

  fs.writeFileSync("translated_animaltext.sql", newSqlContent);
  console.log('Fertig! Neue Datei "translated_animaltext.sql" wurde erstellt.');
}

processSql();
