/**
 * Seeds MayorQuestObjectiveText translations for all 6 locales.
 * Usage: npx tsx scripts/seed-mayor-quest-objective-translations.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// questSortOrder → objectives in order → translations per locale
const data: {
  questSortOrder: number;
  objectives: Record<string, string>[];
}[] = [
  {
    questSortOrder: 1,
    objectives: [
      {
        en: "Have 12 different species",
        de: "12 verschiedene Tierarten besitzen",
        fr: "Avoir 12 espèces différentes",
        es: "Tener 12 especies diferentes",
        da: "Hav 12 forskellige dyrearter",
        nl: "Heb 12 verschillende soorten",
      },
      {
        en: "Expand the zoo 5 times",
        de: "Den Zoo 5 Mal erweitern",
        fr: "Agrandir le zoo 5 fois",
        es: "Expandir el zoológico 5 veces",
        da: "Udvid zoo 5 gange",
        nl: "Breid de dierentuin 5 keer uit",
      },
      {
        en: "Upgrade the entrance once",
        de: "Den Eingang einmal aufwerten",
        fr: "Améliorer l'entrée une fois",
        es: "Mejorar la entrada una vez",
        da: "Opgrader indgangen én gang",
        nl: "Verbeter de ingang één keer",
      },
    ],
  },
  {
    questSortOrder: 2,
    objectives: [
      {
        en: "Breed 6 different animal species",
        de: "6 verschiedene Tierarten züchten",
        fr: "Élever 6 espèces animales différentes",
        es: "Criar 6 especies animales diferentes",
        da: "Avl 6 forskellige dyrearter",
        nl: "Fokken van 6 verschillende diersoorten",
      },
    ],
  },
  {
    questSortOrder: 3,
    objectives: [
      {
        en: "Have 20 different animal species",
        de: "20 verschiedene Tierarten besitzen",
        fr: "Avoir 20 espèces animales différentes",
        es: "Tener 20 especies animales diferentes",
        da: "Hav 20 forskellige dyrearter",
        nl: "Heb 20 verschillende diersoorten",
      },
      {
        en: "Have 40 visitors",
        de: "40 Besucher haben",
        fr: "Avoir 40 visiteurs",
        es: "Tener 40 visitantes",
        da: "Hav 40 besøgende",
        nl: "Heb 40 bezoekers",
      },
    ],
  },
  {
    questSortOrder: 4,
    objectives: [
      {
        en: "Expand the zoo 12 times",
        de: "Den Zoo 12 Mal erweitern",
        fr: "Agrandir le zoo 12 fois",
        es: "Expandir el zoológico 12 veces",
        da: "Udvid zoo 12 gange",
        nl: "Breid de dierentuin 12 keer uit",
      },
      {
        en: "Have a Level 5 animal",
        de: "Ein Tier auf Level 5 haben",
        fr: "Avoir un animal de niveau 5",
        es: "Tener un animal de nivel 5",
        da: "Hav et niveau 5 dyr",
        nl: "Heb een level 5 dier",
      },
    ],
  },
  {
    questSortOrder: 5,
    objectives: [
      {
        en: "Upgrade stores 35 times",
        de: "Shops 35 Mal aufwerten",
        fr: "Améliorer les boutiques 35 fois",
        es: "Mejorar las tiendas 35 veces",
        da: "Opgrader butikker 35 gange",
        nl: "Verbeter winkels 35 keer",
      },
      {
        en: "Build 20 stores",
        de: "20 Shops bauen",
        fr: "Construire 20 boutiques",
        es: "Construir 20 tiendas",
        da: "Byg 20 butikker",
        nl: "Bouw 20 winkels",
      },
    ],
  },
  {
    questSortOrder: 6,
    objectives: [
      {
        en: "Have 34 species in the zoo",
        de: "34 Tierarten im Zoo haben",
        fr: "Avoir 34 espèces dans le zoo",
        es: "Tener 34 especies en el zoológico",
        da: "Hav 34 dyrearter i zoo",
        nl: "Heb 34 soorten in de dierentuin",
      },
    ],
  },
  {
    questSortOrder: 7,
    objectives: [
      {
        en: "Build 50 different decorations",
        de: "50 verschiedene Dekorationen bauen",
        fr: "Construire 50 décorations différentes",
        es: "Construir 50 decoraciones diferentes",
        da: "Byg 50 forskellige dekorationer",
        nl: "Bouw 50 verschillende decoraties",
      },
      {
        en: "Upgrade the entrance 5 times",
        de: "Den Eingang 5 Mal aufwerten",
        fr: "Améliorer l'entrée 5 fois",
        es: "Mejorar la entrada 5 veces",
        da: "Opgrader indgangen 5 gange",
        nl: "Verbeter de ingang 5 keer",
      },
      {
        en: "Upgrade stores 45 times",
        de: "Shops 45 Mal aufwerten",
        fr: "Améliorer les boutiques 45 fois",
        es: "Mejorar las tiendas 45 veces",
        da: "Opgrader butikker 45 gange",
        nl: "Verbeter winkels 45 keer",
      },
    ],
  },
  {
    questSortOrder: 8,
    objectives: [
      {
        en: "Enlarge the zoo 30 times",
        de: "Den Zoo 30 Mal vergrößern",
        fr: "Agrandir le zoo 30 fois",
        es: "Ampliar el zoológico 30 veces",
        da: "Forstør zoo 30 gange",
        nl: "Vergroot de dierentuin 30 keer",
      },
      {
        en: "Breed 20 different animal species",
        de: "20 verschiedene Tierarten züchten",
        fr: "Élever 20 espèces animales différentes",
        es: "Criar 20 especies animales diferentes",
        da: "Avl 20 forskellige dyrearter",
        nl: "Fokken van 20 verschillende diersoorten",
      },
    ],
  },
  {
    questSortOrder: 9,
    objectives: [
      {
        en: "Upgrade any entrance 10 times",
        de: "Einen beliebigen Eingang 10 Mal aufwerten",
        fr: "Améliorer n'importe quelle entrée 10 fois",
        es: "Mejorar cualquier entrada 10 veces",
        da: "Opgrader en hvilken som helst indgang 10 gange",
        nl: "Verbeter een willekeurige ingang 10 keer",
      },
      {
        en: "Build 75 different decorations",
        de: "75 verschiedene Dekorationen bauen",
        fr: "Construire 75 décorations différentes",
        es: "Construir 75 decoraciones diferentes",
        da: "Byg 75 forskellige dekorationer",
        nl: "Bouw 75 verschillende decoraties",
      },
      {
        en: "Help 100 friends",
        de: "100 Freunden helfen",
        fr: "Aider 100 amis",
        es: "Ayudar a 100 amigos",
        da: "Hjælp 100 venner",
        nl: "Help 100 vrienden",
      },
    ],
  },
  {
    questSortOrder: 10,
    objectives: [
      {
        en: "Have 100 visitors in your main zoo",
        de: "100 Besucher im Hauptzoo haben",
        fr: "Avoir 100 visiteurs dans votre zoo principal",
        es: "Tener 100 visitantes en tu zoológico principal",
        da: "Hav 100 besøgende i din hoved-zoo",
        nl: "Heb 100 bezoekers in je hoofddierentuin",
      },
      {
        en: "Have 65 different animal species",
        de: "65 verschiedene Tierarten haben",
        fr: "Avoir 65 espèces animales différentes",
        es: "Tener 65 especies animales diferentes",
        da: "Hav 65 forskellige dyrearter",
        nl: "Heb 65 verschillende diersoorten",
      },
      {
        en: "Level 10 Giant Panda in your main zoo",
        de: "Einen Riesenpanda auf Level 10 im Hauptzoo haben",
        fr: "Grand panda de niveau 10 dans votre zoo principal",
        es: "Panda Gigante de nivel 10 en tu zoológico principal",
        da: "Niveau 10 kæmpepanda i din hoved-zoo",
        nl: "Level 10 Grote Panda in je hoofddierentuin",
      },
    ],
  },
  {
    questSortOrder: 11,
    objectives: [
      {
        en: "Expand the zoo 50 times (any region)",
        de: "Den Zoo 50 Mal erweitern (beliebige Region)",
        fr: "Agrandir le zoo 50 fois (n'importe quelle région)",
        es: "Expandir el zoológico 50 veces (cualquier región)",
        da: "Udvid zoo 50 gange (enhver region)",
        nl: "Breid de dierentuin 50 keer uit (elke regio)",
      },
      {
        en: "Place 200 enclosure decorations",
        de: "200 Gehege-Dekorationen platzieren",
        fr: "Placer 200 décorations d'enclos",
        es: "Colocar 200 decoraciones de cercado",
        da: "Placer 200 indhegningsdekorationer",
        nl: "Plaats 200 verblijfsdecoraties",
      },
      {
        en: "Breed 50 different animal species",
        de: "50 verschiedene Tierarten züchten",
        fr: "Élever 50 espèces animales différentes",
        es: "Criar 50 especies animales diferentes",
        da: "Avl 50 forskellige dyrearter",
        nl: "Fokken van 50 verschillende diersoorten",
      },
      {
        en: "Have 25 different flowers",
        de: "25 verschiedene Blumen haben",
        fr: "Avoir 25 fleurs différentes",
        es: "Tener 25 flores diferentes",
        da: "Hav 25 forskellige blomster",
        nl: "Heb 25 verschillende bloemen",
      },
    ],
  },
  {
    questSortOrder: 12,
    objectives: [
      {
        en: "Upgrade shops 72 times",
        de: "Shops 72 Mal aufwerten",
        fr: "Améliorer les boutiques 72 fois",
        es: "Mejorar las tiendas 72 veces",
        da: "Opgrader butikker 72 gange",
        nl: "Verbeter winkels 72 keer",
      },
      {
        en: "Have 80 different animal species",
        de: "80 verschiedene Tierarten haben",
        fr: "Avoir 80 espèces animales différentes",
        es: "Tener 80 especies animales diferentes",
        da: "Hav 80 forskellige dyrearter",
        nl: "Heb 80 verschillende diersoorten",
      },
      {
        en: "Help 100 friends",
        de: "100 Freunden helfen",
        fr: "Aider 100 amis",
        es: "Ayudar a 100 amigos",
        da: "Hjælp 100 venner",
        nl: "Help 100 vrienden",
      },
    ],
  },
  {
    questSortOrder: 13,
    objectives: [
      {
        en: "Open 50 new Retro Chests",
        de: "50 neue Retro-Truhen öffnen",
        fr: "Ouvrir 50 nouveaux coffres rétro",
        es: "Abrir 50 cofres retro nuevos",
        da: "Åbn 50 nye retrokister",
        nl: "Open 50 nieuwe retrokisten",
      },
      {
        en: "Open 50 new Legendary Chests",
        de: "50 neue legendäre Truhen öffnen",
        fr: "Ouvrir 50 nouveaux coffres légendaires",
        es: "Abrir 50 cofres legendarios nuevos",
        da: "Åbn 50 nye legendariske kister",
        nl: "Open 50 nieuwe legendarische kisten",
      },
      {
        en: "Obtain 35,000 Tickets by scrapping",
        de: "35.000 Tickets durch Verschrotten erhalten",
        fr: "Obtenir 35 000 tickets en ferraillant",
        es: "Obtener 35.000 tickets chatarrando",
        da: "Få 35.000 billetter ved at skrotte",
        nl: "Verkrijg 35.000 tickets door te slopen",
      },
      {
        en: "Complete 250 Puzzle Pieces",
        de: "250 Puzzleteile vervollständigen",
        fr: "Compléter 250 pièces de puzzle",
        es: "Completar 250 piezas de puzle",
        da: "Fuldfør 250 puslespilsbrikker",
        nl: "Voltooi 250 puzzelstukjes",
      },
    ],
  },
  {
    questSortOrder: 14,
    objectives: [
      {
        en: "Have 9 different path types",
        de: "9 verschiedene Wegtypen haben",
        fr: "Avoir 9 types de chemins différents",
        es: "Tener 9 tipos de caminos diferentes",
        da: "Hav 9 forskellige stityper",
        nl: "Heb 9 verschillende padtypen",
      },
      {
        en: "Have 8 terrain types",
        de: "8 Geländetypen haben",
        fr: "Avoir 8 types de terrain",
        es: "Tener 8 tipos de terreno",
        da: "Hav 8 terræntyper",
        nl: "Heb 8 terreintypen",
      },
      {
        en: "Use Terrain Editor 500 times",
        de: "Den Terrain-Editor 500 Mal verwenden",
        fr: "Utiliser l'éditeur de terrain 500 fois",
        es: "Usar el editor de terreno 500 veces",
        da: "Brug terrainredigeringsværktøjet 500 gange",
        nl: "Gebruik de terreineditor 500 keer",
      },
      {
        en: "Have 500,000 total popularity from decorations in all regions",
        de: "500.000 Gesamtbeliebtheit durch Dekorationen in allen Regionen erreichen",
        fr: "Avoir 500 000 de popularité totale grâce aux décorations dans toutes les régions",
        es: "Tener 500.000 de popularidad total por decoraciones en todas las regiones",
        da: "Hav 500.000 samlet popularitet fra dekorationer i alle regioner",
        nl: "Heb 500.000 totale populariteit van decoraties in alle regio's",
      },
    ],
  },
  {
    questSortOrder: 15,
    objectives: [
      {
        en: "Build 600 different decorations",
        de: "600 verschiedene Dekorationen bauen",
        fr: "Construire 600 décorations différentes",
        es: "Construir 600 decoraciones diferentes",
        da: "Byg 600 forskellige dekorationer",
        nl: "Bouw 600 verschillende decoraties",
      },
      {
        en: "Have 50 different animal species at level 20 in your main zoo",
        de: "50 verschiedene Tierarten auf Level 20 im Hauptzoo haben",
        fr: "Avoir 50 espèces animales différentes au niveau 20 dans votre zoo principal",
        es: "Tener 50 especies animales diferentes en nivel 20 en tu zoológico principal",
        da: "Hav 50 forskellige dyrearter på niveau 20 i din hoved-zoo",
        nl: "Heb 50 verschillende diersoorten op level 20 in je hoofddierentuin",
      },
      {
        en: "Have 175 different animal species",
        de: "175 verschiedene Tierarten haben",
        fr: "Avoir 175 espèces animales différentes",
        es: "Tener 175 especies animales diferentes",
        da: "Hav 175 forskellige dyrearter",
        nl: "Heb 175 verschillende diersoorten",
      },
    ],
  },
];

async function main() {
  let count = 0;

  for (const questData of data) {
    const quest = await prisma.mayorQuest.findUnique({
      where: { sortOrder: questData.questSortOrder },
      include: { objectives: { orderBy: { sortOrder: "asc" } } },
    });
    if (!quest) { console.warn(`Quest sortOrder ${questData.questSortOrder} not found`); continue; }

    for (let i = 0; i < questData.objectives.length; i++) {
      const objective = quest.objectives[i];
      if (!objective) { console.warn(`Objective ${i + 1} not found for quest ${questData.questSortOrder}`); continue; }

      const locales = questData.objectives[i];
      for (const [languageCode, text] of Object.entries(locales)) {
        await prisma.mayorQuestObjectiveText.upsert({
          where: { objectiveId_languageCode: { objectiveId: objective.id, languageCode } },
          create: { objectiveId: objective.id, languageCode, text },
          update: { text },
        });
        count++;
      }
    }
  }

  console.log(`Inserted/updated ${count} objective translation records.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
