/**
 * Inserts zoo item translations (de, fr, es, da, nl) into levelrewardtext.
 * English records already exist from the migration.
 *
 * Usage: npx tsx scripts/seed-levelreward-translations.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// levelId → translations per locale
// English texts are already in the DB; only missing locales listed here.
const translations: Record<number, Record<string, string>> = {
  1: {
    de: "Startlevel",
    fr: "Niveau de départ",
    es: "Nivel inicial",
    da: "Startniveau",
    nl: "Startniveau",
  },
  2: {
    de: "5 Bäume",
    fr: "5 arbres",
    es: "5 árboles",
    da: "5 træer",
    nl: "5 bomen",
  },
  3: {
    de: "5 Blumen",
    fr: "5 fleurs",
    es: "5 flores",
    da: "5 blomster",
    nl: "5 bloemen",
  },
  4: {
    de: "5 Kakteen",
    fr: "5 cactus",
    es: "5 cactus",
    da: "5 kaktusse",
    nl: "5 cactussen",
  },
  7: {
    de: "10 Eisenzäune",
    fr: "10 clôtures en fer",
    es: "10 vallas de hierro",
    da: "10 jernhegn",
    nl: "10 ijzeren hekken",
  },
  8: {
    de: "1 Getränkestand",
    fr: "1 kiosque à boissons",
    es: "1 puesto de bebidas",
    da: "1 drikkebod",
    nl: "1 drankenkraam",
  },
  13: {
    de: "5 Blumen",
    fr: "5 fleurs",
    es: "5 flores",
    da: "5 blomster",
    nl: "5 bloemen",
  },
  14: {
    de: "2 Esskastanienbäume",
    fr: "2 châtaigniers",
    es: "2 castaños",
    da: "2 kastanjetræer",
    nl: "2 kastanjebomen",
  },
  15: {
    de: "10 Blumen",
    fr: "10 fleurs",
    es: "10 flores",
    da: "10 blomster",
    nl: "10 bloemen",
  },
  17: {
    de: "3 Rosa Rosensträucher",
    fr: "3 rosiers roses",
    es: "3 rosales rosas",
    da: "3 lyserøde rosenbuske",
    nl: "3 roze rozenstruiken",
  },
  20: {
    de: "15 Weiße Eisenzäune",
    fr: "15 clôtures en fer blanc",
    es: "15 vallas de hierro blancas",
    da: "15 hvide jernhegn",
    nl: "15 witte ijzeren hekken",
  },
  21: {
    de: "2 Pflaumenbäume",
    fr: "2 pruniers",
    es: "2 ciruelos",
    da: "2 blommetræer",
    nl: "2 pruimenbomen",
  },
  25: {
    de: "3 Rote Photinien",
    fr: "3 photinias rouges",
    es: "3 fotinias rojas",
    da: "3 røde photiniaer",
    nl: "3 rode photinia's",
  },
  28: {
    de: "20 Steinwege",
    fr: "20 allées en pierre",
    es: "20 caminos de piedra",
    da: "20 stenstier",
    nl: "20 stenen paden",
  },
  30: {
    de: "1 Rosenbogen",
    fr: "1 arche de roses",
    es: "1 arco de rosas",
    da: "1 rosenbue",
    nl: "1 rozenboog",
  },
  31: {
    de: "10 Blumen",
    fr: "10 fleurs",
    es: "10 flores",
    da: "10 blomster",
    nl: "10 bloemen",
  },
  35: {
    de: "3 Büsche",
    fr: "3 buissons",
    es: "3 arbustos",
    da: "3 buske",
    nl: "3 struiken",
  },
  38: {
    de: "1 Lila Rosenholzbaum",
    fr: "1 palissandre lilas",
    es: "1 palo de rosa lila",
    da: "1 lilla rosentræ",
    nl: "1 lila rozenhouten boom",
  },
  47: {
    de: "10 Steinmauern",
    fr: "10 murs en pierre",
    es: "10 muros de piedra",
    da: "10 stenmure",
    nl: "10 stenen muren",
  },
  48: {
    de: "1 Philodendron (Dschungel)",
    fr: "1 philodendron (Jungle)",
    es: "1 filodendro (Selva)",
    da: "1 philodendron (Jungle)",
    nl: "1 philodendron (Jungle)",
  },
  51: {
    de: "3 Büsche",
    fr: "3 buissons",
    es: "3 arbustos",
    da: "3 buske",
    nl: "3 struiken",
  },
  57: {
    de: "1 Busch",
    fr: "1 buisson",
    es: "1 arbusto",
    da: "1 busk",
    nl: "1 struik",
  },
  62: {
    de: "1 Magnolie",
    fr: "1 magnolia",
    es: "1 magnolia",
    da: "1 magnolia",
    nl: "1 magnolia",
  },
  64: {
    de: "10 Gelbe Stiefmütterchen",
    fr: "10 pensées jaunes",
    es: "10 pensamientos amarillos",
    da: "10 gule stedmoderblomster",
    nl: "10 gele viooltjes",
  },
  68: {
    de: "1 Gelber Rosenholzbaum",
    fr: "1 palissandre jaune",
    es: "1 palo de rosa amarillo",
    da: "1 gult rosentræ",
    nl: "1 gele rozenhouten boom",
  },
  74: {
    de: "2 Rosa Rhododendren",
    fr: "2 rhododendrons roses",
    es: "2 rododendros rosas",
    da: "2 lyserøde rhododendron",
    nl: "2 roze rododendrons",
  },
  78: {
    de: "2 Rosa Hibiskus",
    fr: "2 hibiscus roses",
    es: "2 hibiscos rosas",
    da: "2 lyserøde hibiskus",
    nl: "2 roze hibiscus",
  },
  82: {
    de: "1 Roter Japanischer Ahorn",
    fr: "1 érable japonais rouge",
    es: "1 arce japonés rojo",
    da: "1 rød japansk ahorn",
    nl: "1 rode Japanse esdoorn",
  },
  84: {
    de: "10 Rosa Rittersporn",
    fr: "10 pieds d'alouette roses",
    es: "10 espuelas de caballero rosas",
    da: "10 lyserøde riddersporer",
    nl: "10 roze riddersporen",
  },
  87: {
    de: "10 Orange Lilien",
    fr: "10 lys oranges",
    es: "10 lirios naranjas",
    da: "10 orange liljer",
    nl: "10 oranje lelies",
  },
  88: {
    de: "1 Kastanie mit rosa Blüten",
    fr: "1 châtaignier à fleurs roses",
    es: "1 castaño de flores rosas",
    da: "1 kastanje med lyserøde blomster",
    nl: "1 kastanje met roze bloesem",
  },
  90: {
    de: "10 Rote Lilien",
    fr: "10 lys rouges",
    es: "10 lirios rojos",
    da: "10 røde liljer",
    nl: "10 rode lelies",
  },
  91: {
    de: "3 Weiße Rosensträucher",
    fr: "3 rosiers blancs",
    es: "3 rosales blancos",
    da: "3 hvide rosenbuske",
    nl: "3 witte rozenstruiken",
  },
  94: {
    de: "3 Gelbe Dahlien",
    fr: "3 dahlias jaunes",
    es: "3 dalias amarillas",
    da: "3 gule georginer",
    nl: "3 gele dahlia's",
  },
  101: {
    de: "5 Riesige Rote Lilien",
    fr: "5 grands lys rouges",
    es: "5 lirios rojos enormes",
    da: "5 enorme røde liljer",
    nl: "5 enorme rode lelies",
  },
  103: {
    de: "1 Wald-Toilette",
    fr: "1 toilettes forestières",
    es: "1 baño forestal",
    da: "1 skov-toilet",
    nl: "1 bos-toilet",
  },
  104: {
    de: "2 Dschungel-Laternen",
    fr: "2 lanternes de jungle",
    es: "2 faroles de jungla",
    da: "2 junglelygter",
    nl: "2 junglelampen",
  },
  109: {
    de: "5 Gelber Hibiskus",
    fr: "5 hibiscus jaunes",
    es: "5 hibiscos amarillos",
    da: "5 gule hibiskus",
    nl: "5 gele hibiscus",
  },
  111: {
    de: "1 Weißer Rhododendron",
    fr: "1 rhododendron blanc",
    es: "1 rododendro blanco",
    da: "1 hvid rhododendron",
    nl: "1 witte rododendron",
  },
  113: {
    de: "2 Savanne-Laternen",
    fr: "2 lanternes de savane",
    es: "2 faroles de sabana",
    da: "2 savannelygter",
    nl: "2 savannelampen",
  },
  119: {
    de: "2 Berg-Laternen",
    fr: "2 lanternes de montagne",
    es: "2 faroles de montaña",
    da: "2 bjerglygter",
    nl: "2 berglampen",
  },
  121: {
    de: "1 Lila Rhododendron",
    fr: "1 rhododendron violet",
    es: "1 rododendro morado",
    da: "1 lilla rhododendron",
    nl: "1 paarse rododendron",
  },
  123: {
    de: "5 Gemischte Hortensien",
    fr: "5 hortensias mélangés",
    es: "5 hortensias mixtas",
    da: "5 blandede hortensia",
    nl: "5 gemengde hortensia's",
  },
  126: {
    de: "5 Großer Blauer Bambus",
    fr: "5 grands bambous bleus",
    es: "5 grandes bambús azules",
    da: "5 store blå bambus",
    nl: "5 grote blauwe bamboes",
  },
  129: {
    de: "1 Eis-Toilette",
    fr: "1 toilettes arctiques",
    es: "1 baño ártico",
    da: "1 is-toilet",
    nl: "1 ijs-toilet",
  },
  131: {
    de: "1 Bunter Goldregen",
    fr: "1 cytise coloré",
    es: "1 lluvia de oro colorida",
    da: "1 farverig guldregn",
    nl: "1 kleurrijke goudenregen",
  },
};

async function main() {
  let inserted = 0;

  for (const [levelIdStr, locales] of Object.entries(translations)) {
    const levelId = Number(levelIdStr);
    for (const [languageCode, zooItems] of Object.entries(locales)) {
      await prisma.levelRewardText.upsert({
        where: { levelId_languageCode: { levelId, languageCode } },
        create: { levelId, languageCode, zooItems },
        update: { zooItems },
      });
      inserted++;
    }
  }

  console.log(`Inserted/updated ${inserted} translation records.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
