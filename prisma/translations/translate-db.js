/**
 * Übersetzt alle animaltext-Einträge für DE und DA basierend auf den englischen (EN) Texten.
 * Verwendet DeepL API und schreibt die Ergebnisse direkt in die Datenbank zurück.
 *
 * Aufruf: node prisma/translations/translate-db.js
 */

require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const deepl = require("deepl-node");

const prisma = new PrismaClient();
const translator = new deepl.Translator(process.env.DEEPL_API_KEY.trim());

const TARGET_LANGS = ["de", "da"];

// DeepL erwartet Großbuchstaben für Zielsprachen
const DEEPL_TARGET = {
  de: "DE",
  da: "DA",
};

// Kleine Pause zwischen API-Calls um Rate-Limits zu vermeiden
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateAnimalTexts() {
  // 1. Alle englischen Einträge laden
  const enEntries = await prisma.animalText.findMany({
    where: { languageCode: "en" },
    orderBy: { animalId: "asc" },
  });

  console.log(`\n${enEntries.length} englische Einträge gefunden. Starte Übersetzung...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < enEntries.length; i++) {
    const entry = enEntries[i];
    console.log(`[${i + 1}/${enEntries.length}] animalId=${entry.animalId}: "${entry.animalName}"`);

    for (const lang of TARGET_LANGS) {
      const targetLang = DEEPL_TARGET[lang];

      try {
        // Name übersetzen
        const nameResult = await translator.translateText(entry.animalName, "EN", targetLang);
        await sleep(100);

        // Beschreibung übersetzen (falls vorhanden)
        let translatedDesc = null;
        if (entry.animalDescription) {
          const descResult = await translator.translateText(entry.animalDescription, "EN", targetLang);
          translatedDesc = descResult.text;
          await sleep(100);
        }

        // Upsert: vorhandenen Eintrag aktualisieren oder neu anlegen
        await prisma.animalText.upsert({
          where: {
            animalId_languageCode: {
              animalId: entry.animalId,
              languageCode: lang,
            },
          },
          update: {
            animalName: nameResult.text,
            animalDescription: translatedDesc,
          },
          create: {
            animalId: entry.animalId,
            languageCode: lang,
            animalName: nameResult.text,
            animalDescription: translatedDesc,
          },
        });

        console.log(`  [${lang.toUpperCase()}] "${nameResult.text}"`);
        successCount++;
      } catch (err) {
        console.error(`  [${lang.toUpperCase()}] FEHLER: ${err.message}`);
        errorCount++;
      }
    }
  }

  console.log(`\nFertig! ${successCount} Einträge erfolgreich übersetzt, ${errorCount} Fehler.`);
}

translateAnimalTexts()
  .catch((err) => {
    console.error("Kritischer Fehler:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());