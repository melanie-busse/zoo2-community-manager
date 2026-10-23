/**
 * Seeds MayorQuestText translations for all 6 locales.
 * Usage: npx tsx scripts/seed-mayor-quest-translations.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestTranslation = {
  sortOrder: number;
  locales: Record<string, { titleName: string; miscReward: string; questName: string }>;
};

const translations: QuestTranslation[] = [
  {
    sortOrder: 1,
    locales: {
      en: { titleName: "Title 1: Small Town Zoo",         miscReward: "1 baby horse (lvl 1), 1 rare chest, 10 keys",       questName: "Lofty Aspirations" },
      de: { titleName: "Titel 1: Kleinstadt-Zoo",         miscReward: "1 Babypferd (Lvl. 1), 1 seltene Truhe, 10 Schlüssel", questName: "Hochfliegende Ambitionen" },
      fr: { titleName: "Titre 1 : Zoo de Petite Ville",   miscReward: "1 poulain (niv. 1), 1 coffre rare, 10 clés",         questName: "Ambitions Élevées" },
      es: { titleName: "Título 1: Zoológico de Pueblo",   miscReward: "1 caballo bebé (niv. 1), 1 cofre raro, 10 llaves",   questName: "Grandes Aspiraciones" },
      da: { titleName: "Titel 1: Lille By Zoo",           miscReward: "1 babyhest (lvl. 1), 1 sjælden kiste, 10 nøgler",    questName: "Høje Ambitioner" },
      nl: { titleName: "Titel 1: Kleine Stad Dierentuin", miscReward: "1 babypaard (lvl. 1), 1 zeldzame kist, 10 sleutels", questName: "Hoge Ambities" },
    },
  },
  {
    sortOrder: 2,
    locales: {
      en: { titleName: "Title 2: Conservationist Zoo",        miscReward: "25 diamonds, 1 Lion, 1 rare chest",              questName: "Uphill Battle" },
      de: { titleName: "Titel 2: Naturschutz-Zoo",            miscReward: "25 Diamanten, 1 Löwe, 1 seltene Truhe",          questName: "Schwerer Kampf" },
      fr: { titleName: "Titre 2 : Zoo Conservationniste",     miscReward: "25 diamants, 1 lion, 1 coffre rare",             questName: "Bataille Difficile" },
      es: { titleName: "Título 2: Zoológico Conservacionista",miscReward: "25 diamantes, 1 León, 1 cofre raro",             questName: "Batalla Cuesta Arriba" },
      da: { titleName: "Titel 2: Naturbevarelse Zoo",         miscReward: "25 diamanter, 1 løve, 1 sjælden kiste",          questName: "Hård Kamp" },
      nl: { titleName: "Titel 2: Natuurbehoud Dierentuin",    miscReward: "25 diamanten, 1 Leeuw, 1 zeldzame kist",         questName: "Zware Strijd" },
    },
  },
  {
    sortOrder: 3,
    locales: {
      en: { titleName: "Title 3: Start Up Zoo",         miscReward: "30 diamonds",    questName: "Anonymous Donor" },
      de: { titleName: "Titel 3: Start-up-Zoo",         miscReward: "30 Diamanten",   questName: "Anonymer Spender" },
      fr: { titleName: "Titre 3 : Zoo Start-Up",        miscReward: "30 diamants",    questName: "Donateur Anonyme" },
      es: { titleName: "Título 3: Zoológico Start-Up",  miscReward: "30 diamantes",   questName: "Donante Anónimo" },
      da: { titleName: "Titel 3: Start-up Zoo",         miscReward: "30 diamanter",   questName: "Anonym Donor" },
      nl: { titleName: "Titel 3: Start-up Dierentuin",  miscReward: "30 diamanten",   questName: "Anonieme Donor" },
    },
  },
  {
    sortOrder: 4,
    locales: {
      en: { titleName: "Title 4: Champion Zoo",         miscReward: "35 diamonds, 1 animal fountain",       questName: "Master Breeding" },
      de: { titleName: "Titel 4: Champion-Zoo",         miscReward: "35 Diamanten, 1 Tierfontäne",          questName: "Meister der Zucht" },
      fr: { titleName: "Titre 4 : Zoo Champion",        miscReward: "35 diamants, 1 fontaine animalière",   questName: "Maître de l'Élevage" },
      es: { titleName: "Título 4: Zoológico Campeón",   miscReward: "35 diamantes, 1 fuente de animales",   questName: "Maestro de la Cría" },
      da: { titleName: "Titel 4: Champion Zoo",         miscReward: "35 diamanter, 1 dyrefontæne",          questName: "Avlsmester" },
      nl: { titleName: "Titel 4: Kampioen Dierentuin",  miscReward: "35 diamanten, 1 dierfontein",          questName: "Fokmeester" },
    },
  },
  {
    sortOrder: 5,
    locales: {
      en: { titleName: "Title 5: Adventure Zoo",        miscReward: "40 diamonds, 1 Souvenir Cart",       questName: "Raining Money" },
      de: { titleName: "Titel 5: Abenteuer-Zoo",        miscReward: "40 Diamanten, 1 Souvenirwagen",      questName: "Geldregen" },
      fr: { titleName: "Titre 5 : Zoo Aventure",        miscReward: "40 diamants, 1 chariot à souvenirs", questName: "Pluie d'Argent" },
      es: { titleName: "Título 5: Zoológico de Aventura",miscReward: "40 diamantes, 1 carrito de souvenirs",questName: "Lluvia de Dinero" },
      da: { titleName: "Titel 5: Eventyr Zoo",          miscReward: "40 diamanter, 1 souvenirkiosk",      questName: "Pengeregn" },
      nl: { titleName: "Titel 5: Avontuur Dierentuin",  miscReward: "40 diamanten, 1 souvenirkar",        questName: "Geldstortbui" },
    },
  },
  {
    sortOrder: 6,
    locales: {
      en: { titleName: "Title 6: Premium Zoo",        miscReward: "10 diamonds, 5,000 coins, 3 Rare Chests",        questName: "Excellent!" },
      de: { titleName: "Titel 6: Premium-Zoo",        miscReward: "10 Diamanten, 5.000 Münzen, 3 seltene Truhen",   questName: "Ausgezeichnet!" },
      fr: { titleName: "Titre 6 : Zoo Premium",       miscReward: "10 diamants, 5 000 pièces, 3 coffres rares",     questName: "Excellent !" },
      es: { titleName: "Título 6: Zoológico Premium", miscReward: "10 diamantes, 5.000 monedas, 3 cofres raros",    questName: "¡Excelente!" },
      da: { titleName: "Titel 6: Premium Zoo",        miscReward: "10 diamanter, 5.000 mønter, 3 sjældne kister",   questName: "Fremragende!" },
      nl: { titleName: "Titel 6: Premium Dierentuin", miscReward: "10 diamanten, 5.000 munten, 3 zeldzame kisten",  questName: "Uitstekend!" },
    },
  },
  {
    sortOrder: 7,
    locales: {
      en: { titleName: "Title 7: Sensational Zoo",        miscReward: "50 diamonds, 3 lilac rosewood tree",       questName: "A Sensation!" },
      de: { titleName: "Titel 7: Sensationeller Zoo",     miscReward: "50 Diamanten, 3 Lila Rosenholzbäume",      questName: "Eine Sensation!" },
      fr: { titleName: "Titre 7 : Zoo Sensationnel",      miscReward: "50 diamants, 3 palissandres lilas",        questName: "Une Sensation !" },
      es: { titleName: "Título 7: Zoológico Sensacional", miscReward: "50 diamantes, 3 palos de rosa lila",       questName: "¡Una Sensación!" },
      da: { titleName: "Titel 7: Sensationel Zoo",        miscReward: "50 diamanter, 3 lilla rosentræer",         questName: "En Sensation!" },
      nl: { titleName: "Titel 7: Sensationele Dierentuin",miscReward: "50 diamanten, 3 lila rozenhouten bomen",   questName: "Een Sensatie!" },
    },
  },
  {
    sortOrder: 8,
    locales: {
      en: { titleName: "Title 8: Top 3",  miscReward: "50 diamonds, 5,000 coins, 1 Lilypad Pond",              questName: "Top 3" },
      de: { titleName: "Titel 8: Top 3",  miscReward: "50 Diamanten, 5.000 Münzen, 1 Seerosenteich",           questName: "Top 3" },
      fr: { titleName: "Titre 8 : Top 3", miscReward: "50 diamants, 5 000 pièces, 1 étang aux nénuphars",      questName: "Top 3" },
      es: { titleName: "Título 8: Top 3", miscReward: "50 diamantes, 5.000 monedas, 1 estanque de nenúfares",  questName: "Top 3" },
      da: { titleName: "Titel 8: Top 3",  miscReward: "50 diamanter, 5.000 mønter, 1 åkandepyt",               questName: "Top 3" },
      nl: { titleName: "Titel 8: Top 3",  miscReward: "50 diamanten, 5.000 munten, 1 waterleliepoel",          questName: "Top 3" },
    },
  },
  {
    sortOrder: 9,
    locales: {
      en: { titleName: "Title 9: Iconic Zoo",         miscReward: "75 diamonds, 50 energy, 1 Friendship Flowerbed",       questName: "Iconic Zoo" },
      de: { titleName: "Titel 9: Ikonischer Zoo",     miscReward: "75 Diamanten, 50 Energie, 1 Freundschafts-Blumenbeet", questName: "Ikonischer Zoo" },
      fr: { titleName: "Titre 9 : Zoo Iconique",      miscReward: "75 diamants, 50 énergie, 1 parterre de l'amitié",      questName: "Zoo Iconique" },
      es: { titleName: "Título 9: Zoológico Icónico", miscReward: "75 diamantes, 50 energía, 1 macizo de amistad",        questName: "Zoológico Icónico" },
      da: { titleName: "Titel 9: Ikonisk Zoo",        miscReward: "75 diamanter, 50 energi, 1 venskabsblomsterbed",       questName: "Ikonisk Zoo" },
      nl: { titleName: "Titel 9: Iconische Dierentuin",miscReward: "75 diamanten, 50 energie, 1 vriendschapsbloembed",   questName: "Iconische Dierentuin" },
    },
  },
  {
    sortOrder: 10,
    locales: {
      en: { titleName: "Title 10: World Class Zoo",         miscReward: "100 diamonds, 1 Lion globe",       questName: "World Class Zoo" },
      de: { titleName: "Titel 10: Weltklasse-Zoo",          miscReward: "100 Diamanten, 1 Löwen-Globus",    questName: "Weltklasse-Zoo" },
      fr: { titleName: "Titre 10 : Zoo de Classe Mondiale", miscReward: "100 diamants, 1 globe lion",       questName: "Zoo de Classe Mondiale" },
      es: { titleName: "Título 10: Zoológico de Clase Mundial",miscReward: "100 diamantes, 1 globo de león",questName: "Zoológico de Clase Mundial" },
      da: { titleName: "Titel 10: Verdensklasse Zoo",       miscReward: "100 diamanter, 1 løveglobe",       questName: "Verdensklasse Zoo" },
      nl: { titleName: "Titel 10: Wereldklasse Dierentuin", miscReward: "100 diamanten, 1 leeuwenbol",      questName: "Wereldklasse Dierentuin" },
    },
  },
  {
    sortOrder: 11,
    locales: {
      en: { titleName: "Title 11: Zoo Phenomenon",      miscReward: "125 diamonds, 3 Laburnum",       questName: "Zoo Phenomenon" },
      de: { titleName: "Titel 11: Zoo-Phänomen",        miscReward: "125 Diamanten, 3 Goldregen",     questName: "Zoo-Phänomen" },
      fr: { titleName: "Titre 11 : Phénomène Zoo",      miscReward: "125 diamants, 3 cytises",        questName: "Phénomène Zoo" },
      es: { titleName: "Título 11: Fenómeno Zoológico", miscReward: "125 diamantes, 3 laburno",       questName: "Fenómeno Zoológico" },
      da: { titleName: "Titel 11: Zoo Fænomen",         miscReward: "125 diamanter, 3 guldregn",      questName: "Zoo Fænomen" },
      nl: { titleName: "Titel 11: Zoo Fenomeen",        miscReward: "125 diamanten, 3 goudenregen",   questName: "Zoo Fenomeen" },
    },
  },
  {
    sortOrder: 12,
    locales: {
      en: { titleName: "Title 12: Guiding Star Zoo",         miscReward: "150 diamonds, 1 Legendary Chest, 1 Retro Chest, 10,000 coins",          questName: "Guiding Star Zoo" },
      de: { titleName: "Titel 12: Leitstern-Zoo",            miscReward: "150 Diamanten, 1 legendäre Truhe, 1 Retro-Truhe, 10.000 Münzen",        questName: "Leitstern-Zoo" },
      fr: { titleName: "Titre 12 : Zoo Étoile Directrice",   miscReward: "150 diamants, 1 coffre légendaire, 1 coffre rétro, 10 000 pièces",       questName: "Zoo Étoile Directrice" },
      es: { titleName: "Título 12: Zoológico Estrella Guía", miscReward: "150 diamantes, 1 cofre legendario, 1 cofre retro, 10.000 monedas",       questName: "Zoológico Estrella Guía" },
      da: { titleName: "Titel 12: Ledestjerne Zoo",          miscReward: "150 diamanter, 1 legendarisk kiste, 1 retrokiste, 10.000 mønter",        questName: "Ledestjerne Zoo" },
      nl: { titleName: "Titel 12: Leidster Dierentuin",      miscReward: "150 diamanten, 1 legendarische kist, 1 retrokist, 10.000 munten",        questName: "Leidster Dierentuin" },
    },
  },
  {
    sortOrder: 13,
    locales: {
      en: { titleName: "Title 13: Treasure Hunter Zoo",        miscReward: "175 diamonds, 20 keys, 1 Pirate Playground",     questName: "Treasure Hunter Zoo" },
      de: { titleName: "Titel 13: Schatzjäger-Zoo",            miscReward: "175 Diamanten, 20 Schlüssel, 1 Piraten-Spielplatz",questName: "Schatzjäger-Zoo" },
      fr: { titleName: "Titre 13 : Zoo Chasseur de Trésors",   miscReward: "175 diamants, 20 clés, 1 aire de jeux pirate",   questName: "Zoo Chasseur de Trésors" },
      es: { titleName: "Título 13: Zoológico Cazador de Tesoros",miscReward: "175 diamantes, 20 llaves, 1 parque de piratas",questName: "Zoológico Cazador de Tesoros" },
      da: { titleName: "Titel 13: Skattejæger Zoo",            miscReward: "175 diamanter, 20 nøgler, 1 piratlegeplads",     questName: "Skattejæger Zoo" },
      nl: { titleName: "Titel 13: Schatzoeker Dierentuin",     miscReward: "175 diamanten, 20 sleutels, 1 piratenspeelplaats",questName: "Schatzoeker Dierentuin" },
    },
  },
  {
    sortOrder: 14,
    locales: {
      en: { titleName: "Title 14: Landscape Designer Zoo",          miscReward: "200 diamonds, 20 pompous paths",         questName: "Landscape Designer Zoo" },
      de: { titleName: "Titel 14: Landschaftsgestalter-Zoo",        miscReward: "200 Diamanten, 20 prunkvolle Wege",      questName: "Landschaftsgestalter-Zoo" },
      fr: { titleName: "Titre 14 : Zoo Paysagiste",                 miscReward: "200 diamants, 20 chemins pompeux",       questName: "Zoo Paysagiste" },
      es: { titleName: "Título 14: Zoológico Diseñador de Paisajes",miscReward: "200 diamantes, 20 caminos suntuosos",    questName: "Zoológico Diseñador de Paisajes" },
      da: { titleName: "Titel 14: Landskabsdesigner Zoo",           miscReward: "200 diamanter, 20 pragtfulde stier",     questName: "Landskabsdesigner Zoo" },
      nl: { titleName: "Titel 14: Landschapsontwerper Dierentuin",  miscReward: "200 diamanten, 20 prachtige paden",      questName: "Landschapsontwerper Dierentuin" },
    },
  },
  {
    sortOrder: 15,
    locales: {
      en: { titleName: "Title 15: Diversity Zoo",       miscReward: "225 diamonds, 2 Legendary Chests, 3 Retro Chests",          questName: "Diversity Zoo" },
      de: { titleName: "Titel 15: Vielfalt-Zoo",        miscReward: "225 Diamanten, 2 legendäre Truhen, 3 Retro-Truhen",         questName: "Vielfalt-Zoo" },
      fr: { titleName: "Titre 15 : Zoo Diversité",      miscReward: "225 diamants, 2 coffres légendaires, 3 coffres rétro",      questName: "Zoo Diversité" },
      es: { titleName: "Título 15: Zoológico de Diversidad",miscReward: "225 diamantes, 2 cofres legendarios, 3 cofres retro",   questName: "Zoológico de Diversidad" },
      da: { titleName: "Titel 15: Mangfoldigheds Zoo",  miscReward: "225 diamanter, 2 legendariske kister, 3 retrokister",       questName: "Mangfoldigheds Zoo" },
      nl: { titleName: "Titel 15: Diversiteits Dierentuin",miscReward: "225 diamanten, 2 legendarische kisten, 3 retrokisten",   questName: "Diversiteits Dierentuin" },
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
