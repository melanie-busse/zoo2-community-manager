/**
 * Seeds MayorQuestText translations for all 6 locales.
 * Usage: npx tsx scripts/seed-mayor-quest-translations.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestTranslation = {
  sortOrder: number;
  locales: Record<string, { titleName: string; tip: string }>;
};

const translations: QuestTranslation[] = [
  {
    sortOrder: 1,
    locales: {
      en: { titleName: "Title 1: Small Town Zoo",       tip: "Lofty Aspirations" },
      de: { titleName: "Titel 1: Kleinstadt-Zoo", tip: "Hochfliegende Ambitionen" },
      fr: { titleName: "Titre 1 : Zoo de Petite Ville",         tip: "Ambitions Élevées" },
      es: { titleName: "Título 1: Zoológico de Pueblo",   tip: "Grandes Aspiraciones" },
      da: { titleName: "Titel 1: Lille By Zoo",    tip: "Høje Ambitioner" },
      nl: { titleName: "Titel 1: Kleine Stad Dierentuin", tip: "Hoge Ambities" },
    },
  },
  {
    sortOrder: 2,
    locales: {
      en: { titleName: "Title 2: Conservationist Zoo",              tip: "Uphill Battle" },
      de: { titleName: "Titel 2: Naturschutz-Zoo",          tip: "Schwerer Kampf" },
      fr: { titleName: "Titre 2 : Zoo Conservationniste",             tip: "Bataille Difficile" },
      es: { titleName: "Título 2: Zoológico Conservacionista",             tip: "Batalla Cuesta Arriba" },
      da: { titleName: "Titel 2: Naturbevarelse Zoo",          tip: "Hård Kamp" },
      nl: { titleName: "Titel 2: Natuurbehoud Dierentuin",         tip: "Zware Strijd" },
    },
  },
  {
    sortOrder: 3,
    locales: {
      en: { titleName: "Title 3: Start Up Zoo",    tip: "Anonymous Donor" },
      de: { titleName: "Titel 3: Start-up-Zoo",   tip: "Anonymer Spender" },
      fr: { titleName: "Titre 3 : Zoo Start-Up",    tip: "Donateur Anonyme" },
      es: { titleName: "Título 3: Zoológico Start-Up",   tip: "Donante Anónimo" },
      da: { titleName: "Titel 3: Start-up Zoo",   tip: "Anonym Donor" },
      nl: { titleName: "Titel 3: Start-up Dierentuin",   tip: "Anonieme Donor" },
    },
  },
  {
    sortOrder: 4,
    locales: {
      en: { titleName: "Title 4: Champion Zoo",       tip: "Master Breeding" },
      de: { titleName: "Titel 4: Champion-Zoo",          tip: "Meister der Zucht" },
      fr: { titleName: "Titre 4 : Zoo Champion",   tip: "Maître de l'Élevage" },
      es: { titleName: "Título 4: Zoológico Campeón",   tip: "Maestro de la Cría" },
      da: { titleName: "Titel 4: Champion Zoo",          tip: "Avlsmester" },
      nl: { titleName: "Titel 4: Kampioen Dierentuin",          tip: "Fokmeester" },
    },
  },
  {
    sortOrder: 5,
    locales: {
      en: { titleName: "Title 5: Adventure Zoo",       tip: "Raining Money" },
      de: { titleName: "Titel 5: Abenteuer-Zoo",      tip: "Geldregen" },
      fr: { titleName: "Titre 5 : Zoo Aventure", tip: "Pluie d'Argent" },
      es: { titleName: "Título 5: Zoológico de Aventura",tip: "Lluvia de Dinero" },
      da: { titleName: "Titel 5: Eventyr Zoo",      tip: "Pengeregn" },
      nl: { titleName: "Titel 5: Avontuur Dierentuin",        tip: "Geldstortbui" },
    },
  },
  {
    sortOrder: 6,
    locales: {
      en: { titleName: "Title 6: Premium Zoo",        tip: "Excellent!" },
      de: { titleName: "Titel 6: Premium-Zoo",   tip: "Ausgezeichnet!" },
      fr: { titleName: "Titre 6 : Zoo Premium",     tip: "Excellent !" },
      es: { titleName: "Título 6: Zoológico Premium",    tip: "¡Excelente!" },
      da: { titleName: "Titel 6: Premium Zoo",   tip: "Fremragende!" },
      nl: { titleName: "Titel 6: Premium Dierentuin",  tip: "Uitstekend!" },
    },
  },
  {
    sortOrder: 7,
    locales: {
      en: { titleName: "Title 7: Sensational Zoo",       tip: "A Sensation!" },
      de: { titleName: "Titel 7: Sensationeller Zoo",      tip: "Eine Sensation!" },
      fr: { titleName: "Titre 7 : Zoo Sensationnel",        tip: "Une Sensation !" },
      es: { titleName: "Título 7: Zoológico Sensacional",       tip: "¡Una Sensación!" },
      da: { titleName: "Titel 7: Sensationel Zoo",         tip: "En Sensation!" },
      nl: { titleName: "Titel 7: Sensationele Dierentuin",   tip: "Een Sensatie!" },
    },
  },
  {
    sortOrder: 8,
    locales: {
      en: { titleName: "Title 8: Top 3",              tip: "Top 3" },
      de: { titleName: "Titel 8: Top 3",           tip: "Top 3" },
      fr: { titleName: "Titre 8 : Top 3",      tip: "Top 3" },
      es: { titleName: "Título 8: Top 3",  tip: "Top 3" },
      da: { titleName: "Titel 8: Top 3",               tip: "Top 3" },
      nl: { titleName: "Titel 8: Top 3",          tip: "Top 3" },
    },
  },
  {
    sortOrder: 9,
    locales: {
      en: { titleName: "Title 9: Iconic Zoo",       tip: "Iconic Zoo" },
      de: { titleName: "Titel 9: Ikonischer Zoo", tip: "Ikonischer Zoo" },
      fr: { titleName: "Titre 9 : Zoo Iconique",      tip: "Zoo Iconique" },
      es: { titleName: "Título 9: Zoológico Icónico",        tip: "Zoológico Icónico" },
      da: { titleName: "Titel 9: Ikonisk Zoo",       tip: "Ikonisk Zoo" },
      nl: { titleName: "Titel 9: Iconische Dierentuin",   tip: "Iconische Dierentuin" },
    },
  },
  {
    sortOrder: 10,
    locales: {
      en: { titleName: "Title 10: World Class Zoo",       tip: "World Class Zoo" },
      de: { titleName: "Titel 10: Weltklasse-Zoo",    tip: "Weltklasse-Zoo" },
      fr: { titleName: "Titre 10 : Zoo de Classe Mondiale",       tip: "Zoo de Classe Mondiale" },
      es: { titleName: "Título 10: Zoológico de Clase Mundial",tip: "Zoológico de Clase Mundial" },
      da: { titleName: "Titel 10: Verdensklasse Zoo",       tip: "Verdensklasse Zoo" },
      nl: { titleName: "Titel 10: Wereldklasse Dierentuin",      tip: "Wereldklasse Dierentuin" },
    },
  },
  {
    sortOrder: 11,
    locales: {
      en: { titleName: "Title 11: Zoo Phenomenon",       tip: "Zoo Phenomenon" },
      de: { titleName: "Titel 11: Zoo-Phänomen",     tip: "Zoo-Phänomen" },
      fr: { titleName: "Titre 11 : Phénomène Zoo",        tip: "Phénomène Zoo" },
      es: { titleName: "Título 11: Fenómeno Zoológico",       tip: "Fenómeno Zoológico" },
      da: { titleName: "Titel 11: Zoo Fænomen",      tip: "Zoo Fænomen" },
      nl: { titleName: "Titel 11: Zoo Fenomeen",   tip: "Zoo Fenomeen" },
    },
  },
  {
    sortOrder: 12,
    locales: {
      en: { titleName: "Title 12: Guiding Star Zoo",          tip: "Guiding Star Zoo" },
      de: { titleName: "Titel 12: Leitstern-Zoo",        tip: "Leitstern-Zoo" },
      fr: { titleName: "Titre 12 : Zoo Étoile Directrice",       tip: "Zoo Étoile Directrice" },
      es: { titleName: "Título 12: Zoológico Estrella Guía",       tip: "Zoológico Estrella Guía" },
      da: { titleName: "Titel 12: Ledestjerne Zoo",        tip: "Ledestjerne Zoo" },
      nl: { titleName: "Titel 12: Leidster Dierentuin",        tip: "Leidster Dierentuin" },
    },
  },
  {
    sortOrder: 13,
    locales: {
      en: { titleName: "Title 13: Treasure Hunter Zoo",     tip: "Treasure Hunter Zoo" },
      de: { titleName: "Titel 13: Schatzjäger-Zoo",tip: "Schatzjäger-Zoo" },
      fr: { titleName: "Titre 13 : Zoo Chasseur de Trésors",   tip: "Zoo Chasseur de Trésors" },
      es: { titleName: "Título 13: Zoológico Cazador de Tesoros",tip: "Zoológico Cazador de Tesoros" },
      da: { titleName: "Titel 13: Skattejæger Zoo",     tip: "Skattejæger Zoo" },
      nl: { titleName: "Titel 13: Schatzoeker Dierentuin",tip: "Schatzoeker Dierentuin" },
    },
  },
  {
    sortOrder: 14,
    locales: {
      en: { titleName: "Title 14: Landscape Designer Zoo",         tip: "Landscape Designer Zoo" },
      de: { titleName: "Titel 14: Landschaftsgestalter-Zoo",      tip: "Landschaftsgestalter-Zoo" },
      fr: { titleName: "Titre 14 : Zoo Paysagiste",       tip: "Zoo Paysagiste" },
      es: { titleName: "Título 14: Zoológico Diseñador de Paisajes",    tip: "Zoológico Diseñador de Paisajes" },
      da: { titleName: "Titel 14: Landskabsdesigner Zoo",     tip: "Landskabsdesigner Zoo" },
      nl: { titleName: "Titel 14: Landschapsontwerper Dierentuin",      tip: "Landschapsontwerper Dierentuin" },
    },
  },
  {
    sortOrder: 15,
    locales: {
      en: { titleName: "Title 15: Diversity Zoo",          tip: "Diversity Zoo" },
      de: { titleName: "Titel 15: Vielfalt-Zoo",         tip: "Vielfalt-Zoo" },
      fr: { titleName: "Titre 15 : Zoo Diversité",      tip: "Zoo Diversité" },
      es: { titleName: "Título 15: Zoológico de Diversidad",   tip: "Zoológico de Diversidad" },
      da: { titleName: "Titel 15: Mangfoldigheds Zoo",       tip: "Mangfoldigheds Zoo" },
      nl: { titleName: "Titel 15: Diversiteits Dierentuin",   tip: "Diversiteits Dierentuin" },
    },
  },
];

async function main() {
  let count = 0;
  for (const q of translations) {
    const quest = await prisma.mayorQuest.findUnique({ where: { sortOrder: q.sortOrder } });
    if (!quest) { console.warn(`Quest sortOrder ${q.sortOrder} not found, skipping`); continue; }

    for (const [languageCode, t] of Object.entries(q.locales)) {
      await prisma.mayorQuestText.upsert({
        where: { questId_languageCode: { questId: quest.id, languageCode } },
        create: { questId: quest.id, languageCode, ...t },
        update: t,
      });
      count++;
    }
  }
  console.log(`Inserted/updated ${count} translation records.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
