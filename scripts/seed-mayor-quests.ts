/**
 * Seeds MayorQuest and MayorQuestObjective data from mayor_quests.pdf.
 * Usage: npx tsx scripts/seed-mayor-quests.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const quests = [
  {
    sortOrder: 1,
    titleName: "Title 1: Small Town Zoo",
    level: 8,
    coinReward: 5000,
    xpReward: 1500,
    miscReward: "1 baby horse (lvl 1), 1 rare chest, 10 keys",
    questName: "Lofty Aspirations",
    objectives: [
      "Have 12 different species",
      "Expand the zoo 5 times",
      "Upgrade the entrance once",
    ],
  },
  {
    sortOrder: 2,
    titleName: "Title 2: Conservationist Zoo",
    level: 12,
    coinReward: 10000,
    xpReward: 3500,
    miscReward: "25 diamonds, 1 Lion, 1 rare chest",
    questName: "Uphill Battle",
    objectives: ["Breed 6 different animal species"],
  },
  {
    sortOrder: 3,
    titleName: "Title 3: Start Up Zoo",
    level: 20,
    coinReward: 15000,
    xpReward: 8000,
    miscReward: "30 diamonds",
    questName: "Anonymous Donor",
    objectives: ["Have 20 different animal species", "Have 40 visitors"],
  },
  {
    sortOrder: 4,
    titleName: "Title 4: Champion Zoo",
    level: 23,
    coinReward: 20000,
    xpReward: 12500,
    miscReward: "35 diamonds, 1 animal fountain",
    questName: "Master Breeding",
    objectives: ["Expand the zoo 12 times", "Have a Level 5 animal"],
  },
  {
    sortOrder: 5,
    titleName: "Title 5: Adventure Zoo",
    level: 28,
    coinReward: 25000,
    xpReward: 20000,
    miscReward: "40 diamonds, 1 Souvenir Cart",
    questName: "Raining Money",
    objectives: ["Upgrade stores 35 times", "Build 20 stores"],
  },
  {
    sortOrder: 6,
    titleName: "Title 6: Premium Zoo",
    level: 33,
    coinReward: 50000,
    xpReward: 30000,
    miscReward: "10 diamonds, 5,000 coins, 3 Rare Chests",
    questName: "Excellent!",
    objectives: ["Have 34 species in the zoo"],
  },
  {
    sortOrder: 7,
    titleName: "Title 7: Sensational Zoo",
    level: 38,
    coinReward: 75000,
    xpReward: 40000,
    miscReward: "50 diamonds, 3 lilac rosewood tree",
    questName: "A Sensation!",
    objectives: [
      "Build 50 different decorations",
      "Upgrade the entrance 5 times",
      "Upgrade stores 45 times",
    ],
  },
  {
    sortOrder: 8,
    titleName: "Title 8: Top 3",
    level: 46,
    coinReward: 100000,
    xpReward: 55000,
    miscReward: "50 diamonds, 5,000 coins, 1 Lilypad Pond",
    questName: "Top 3",
    objectives: ["Enlarge the zoo 30 times", "Breed 20 different animal species"],
  },
  {
    sortOrder: 9,
    titleName: "Title 9: Iconic Zoo",
    level: 55,
    coinReward: 150000,
    xpReward: 70000,
    miscReward: "75 diamonds, 50 energy, 1 Friendship Flowerbed",
    questName: "Iconic Zoo",
    objectives: [
      "Upgrade any entrance 10 times",
      "Build 75 different decorations",
      "Help 100 friends",
    ],
  },
  {
    sortOrder: 10,
    titleName: "Title 10: World Class Zoo",
    level: 71,
    coinReward: 200000,
    xpReward: 100000,
    miscReward: "100 diamonds, 1 Lion globe",
    questName: "World Class Zoo",
    objectives: [
      "Have 100 visitors in your main zoo",
      "Have 65 different animal species",
      "Level 10 Giant Panda in your main zoo",
    ],
  },
  {
    sortOrder: 11,
    titleName: "Title 11: Zoo Phenomenon",
    level: 80,
    coinReward: 250000,
    xpReward: 150000,
    miscReward: "125 diamonds, 3 Laburnum",
    questName: "Zoo Phenomenon",
    objectives: [
      "Expand the zoo 50 times (any region)",
      "Place 200 enclosure decorations",
      "Breed 50 different animal species",
      "Have 25 different flowers",
    ],
  },
  {
    sortOrder: 12,
    titleName: "Title 12: Guiding Star Zoo",
    level: 91,
    coinReward: 300000,
    xpReward: 150000,
    miscReward: "150 diamonds, 1 Legendary Chest, 1 Retro Chest, 10,000 coins",
    questName: "Guiding Star Zoo",
    objectives: [
      "Upgrade shops 72 times",
      "Have 80 different animal species",
      "Help 100 friends",
    ],
  },
  {
    sortOrder: 13,
    titleName: "Title 13: Treasure Hunter Zoo",
    level: 100,
    coinReward: 400000,
    xpReward: 1000000,
    miscReward: "175 diamonds, 20 keys, 1 Pirate Playground",
    questName: "Treasure Hunter Zoo",
    objectives: [
      "Open 50 new Retro Chests",
      "Open 50 new Legendary Chests",
      "Obtain 35,000 Tickets by scrapping",
      "Complete 250 Puzzle Pieces",
    ],
  },
  {
    sortOrder: 14,
    titleName: "Title 14: Landscape Designer Zoo",
    level: 110,
    coinReward: 500000,
    xpReward: 5000000,
    miscReward: "200 diamonds, 20 pompous paths",
    questName: "Landscape Designer Zoo",
    objectives: [
      "Have 9 different path types",
      "Have 8 terrain types",
      "Use Terrain Editor 500 times",
      "Have 500,000 total popularity from decorations in all regions",
    ],
  },
  {
    sortOrder: 15,
    titleName: "Title 15: Diversity Zoo",
    level: 120,
    coinReward: 750000,
    xpReward: 10000000,
    miscReward: "225 diamonds, 2 Legendary Chests, 3 Retro Chests",
    questName: "Diversity Zoo",
    objectives: [
      "Build 600 different decorations",
      "Have 50 different animal species at level 20 in your main zoo",
      "Have 175 different animal species",
    ],
  },
];

async function main() {
  for (const q of quests) {
    await prisma.mayorQuest.upsert({
      where: { sortOrder: q.sortOrder },
      create: {
        sortOrder: q.sortOrder,
        titleName: q.titleName,
        level: q.level,
        coinReward: q.coinReward,
        xpReward: q.xpReward,
        miscReward: q.miscReward,
        questName: q.questName,
        objectives: {
          create: q.objectives.map((text, i) => ({ sortOrder: i + 1, text })),
        },
      },
      update: {
        titleName: q.titleName,
        level: q.level,
        coinReward: q.coinReward,
        xpReward: q.xpReward,
        miscReward: q.miscReward,
        questName: q.questName,
      },
    });
  }
  console.log(`Seeded ${quests.length} mayor quests.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
