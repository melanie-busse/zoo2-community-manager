import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reward-Einträge pro Quest, basierend auf dem PDF.
// Diamanten-Icon:  /images/currency/diamant.webp
// Weitere Item-Bilder: /images/mayorquests/rewards/<name> (müssen noch abgelegt werden)
const questRewards: Record<number, { sortOrder: number; imagePath: string; amount: number }[]> = {
  // Quest 1: Small Town Zoo – Lofty Aspirations
  1: [
    { sortOrder: 1, imagePath: "/images/mayorquests/rewards/baby_horse.png",  amount: 1  },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/chest_rare.png",  amount: 1  },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/key.png",         amount: 10 },
  ],

  // Quest 2: Conservationist Zoo – Uphill Battle
  2: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 25 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/lion.png",        amount: 1  },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/chest_rare.png",  amount: 1  },
  ],

  // Quest 3: Start Up Zoo – Anonymous Donor
  3: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 30 },
  ],

  // Quest 4: Champion Zoo – Master Breeding
  4: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 35 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/animal_fountain.png", amount: 1 },
  ],

  // Quest 5: Adventure Zoo – Raining Money
  5: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 40 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/souvenir_cart.png", amount: 1 },
  ],

  // Quest 6: Premium Zoo – Excellent!
  6: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 10   },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/ticket.png",      amount: 5000 },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/chest_rare.png",  amount: 3    },
  ],

  // Quest 7: Sensational Zoo – A Sensation!
  7: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 50 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/lilac_rosewood.png", amount: 3 },
  ],

  // Quest 8: Top 3
  8: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 50   },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/ticket.png",      amount: 5000 },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/lilypad_pond.png", amount: 1   },
  ],

  // Quest 9: Iconic Zoo
  9: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 75 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/energy.png",      amount: 50 },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/friendship_flowerbed.png", amount: 1 },
  ],

  // Quest 10: World Class Zoo
  10: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 100 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/lion_globe.png",  amount: 1   },
  ],

  // Quest 11: Zoo Phenomenon
  11: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 125 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/laburnum.png",    amount: 3   },
  ],

  // Quest 12: Guiding Star Zoo
  12: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 150   },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/chest_legendary.png", amount: 1 },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/chest_retro.png", amount: 1     },
    { sortOrder: 4, imagePath: "/images/mayorquests/rewards/ticket.png",      amount: 10000 },
  ],

  // Quest 13: Treasure Hunter Zoo
  13: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 175 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/key.png",         amount: 20  },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/pirate_playground.png", amount: 1 },
  ],

  // Quest 14: Landscape Designer Zoo
  14: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 200 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/pompous_path.png", amount: 20  },
  ],

  // Quest 15: Diversity Zoo
  15: [
    { sortOrder: 1, imagePath: "/images/currency/diamant.webp",               amount: 225 },
    { sortOrder: 2, imagePath: "/images/mayorquests/rewards/chest_legendary.png", amount: 2 },
    { sortOrder: 3, imagePath: "/images/mayorquests/rewards/chest_retro.png", amount: 3     },
  ],
};

async function main() {
  let total = 0;

  for (const [questIdStr, rewards] of Object.entries(questRewards)) {
    const questId = Number(questIdStr);

    await prisma.mayorQuestReward.deleteMany({ where: { questId } });
    await prisma.mayorQuestReward.createMany({
      data: rewards.map((r) => ({ questId, ...r })),
    });
    total += rewards.length;
  }

  console.log(`Inserted/replaced ${total} reward records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
