import "server-only";
import { prisma } from "@/lib/prisma";

// XP required to reach the next level (static game data)
const XP_TO_NEXT: Record<number, number> = {
  1: 250, 2: 400, 3: 1300, 4: 2000, 5: 3000, 6: 4000, 7: 6000, 8: 8000,
  9: 10000, 10: 12500, 11: 15000, 12: 17500, 13: 20000, 14: 25000,
  15: 30000, 16: 35000, 17: 40000, 18: 45000, 19: 50000, 20: 55000,
  21: 60000, 22: 65000, 23: 70000, 24: 75000, 25: 80000, 26: 85000,
  27: 90000, 28: 95000, 29: 100000, 30: 110000, 31: 120000, 32: 130000,
  33: 140000, 34: 150000, 35: 160000, 36: 170000, 37: 180000, 38: 190000,
  39: 200000, 40: 220000, 41: 240000, 42: 260000, 43: 280000, 44: 300000,
  45: 320000, 46: 340000, 47: 360000, 48: 380000, 49: 400000, 50: 420000,
  51: 440000, 52: 460000, 53: 480000, 54: 500000, 55: 525000, 56: 550000,
  57: 575000, 58: 600000, 59: 625000, 60: 650000, 61: 675000, 62: 700000,
  63: 725000, 64: 750000, 65: 800000, 66: 850000, 67: 900000, 68: 950000,
  69: 1000000, 70: 1100000, 71: 1200000, 72: 1300000, 73: 1400000,
  74: 1500000, 75: 1600000, 76: 1700000, 77: 1800000, 78: 1900000,
  79: 2000000, 80: 2250000, 81: 2500000, 82: 2750000, 83: 3000000,
  84: 3250000, 85: 3500000, 86: 3750000, 87: 4000000, 88: 4250000,
  89: 4500000, 90: 4750000, 91: 5000000, 92: 5500000, 93: 6000000,
  94: 6500000, 95: 7000000, 96: 7500000, 97: 8000000, 98: 8500000,
  99: 9000000, 100: 19000000, 101: 29000000, 102: 39000000, 103: 49000000,
  104: 59000000, 105: 69000000, 106: 79000000, 107: 89000000, 108: 99000000,
  109: 109000000, 110: 120000000, 111: 131000000, 112: 142000000,
  113: 153000000, 114: 164000000, 115: 175000000, 116: 186000000,
  117: 197000000, 118: 208000000, 119: 219000000, 120: 231000000,
  121: 243000000, 122: 255000000, 123: 267000000, 124: 279000000,
  125: 291000000, 126: 303000000, 127: 315000000, 128: 327000000,
  129: 339000000, 130: 352000000, 131: 365000000, 132: 378000000,
  133: 391000000, 134: 404000000, 135: 417000000, 136: 430000000,
  137: 443000000, 138: 456000000, 139: 469000000, 140: 483000000,
  141: 497000000, 142: 511000000, 143: 525000000, 144: 539000000,
  145: 553000000, 146: 567000000, 147: 581000000, 148: 595000000,
  149: 609000000, 150: 624000000, 151: 639000000, 152: 654000000,
  153: 669000000, 154: 684000000, 155: 699000000, 156: 714000000,
  157: 729000000, 158: 744000000, 159: 759000000, 160: 775000000,
  161: 791000000, 162: 807000000, 163: 823000000, 164: 839000000,
};

export type LevelRewardItem = {
  id: number;
  level: number;
  xpToNext: number | null;
  coins: number | null;
  diamonds: number | null;
  zooItems: string | null;
  enclosureItems: {
    id: number;
    quantity: number;
    name: string;
    biomeIdentifier: string | null;
    localizedName: string | null;
    nameKey: string | null;
    imagePath: string | null;
    biomeLink: string | null;
  }[];
  chests: {
    id: number;
    quantity: number;
    chestType: string;
  }[];
  animalRewards: {
    id: number;
    quantity: number;
    name: string;
    animal: {
      id: number;
      identifier: string | null;
      biomeIdentifier: string | null;
      animalName: string | null;
    } | null;
  }[];
};

export async function getAllLevelRewards(locale: string): Promise<LevelRewardItem[]> {
  const rewards = await prisma.levelReward.findMany({
    orderBy: { level: "asc" },
    include: {
      texts: { where: { languageCode: locale } },
      enclosureItems: {
        include: {
          biomeDecoration: {
            include: {
              biome: { select: { identifier: true } },
              texts: { where: { languageCode: locale } },
            },
          },
          biomeGame: {
            include: {
              texts: { where: { languageCode: locale } },
            },
          },
        },
      },
      chests: true,
      animalRewards: {
        include: {
          animal: {
            include: {
              biome: true,
              animaltext: { where: { languageCode: locale } },
            },
          },
        },
      },
    },
  });

  return rewards.map((r) => ({
    id: r.id,
    level: r.level,
    xpToNext: XP_TO_NEXT[r.level] ?? null,
    coins: r.coins,
    diamonds: r.diamonds,
    zooItems: r.texts[0]?.zooItems ?? null,
    enclosureItems: r.enclosureItems.map((e) => {
      const dec = e.biomeDecoration;
      const game = e.biomeGame;
      const nameLower = e.name.toLowerCase();
      const biome = e.biomeIdentifier;

      let localizedName: string | null = null;
      let nameKey: string | null = null;
      let imagePath: string | null = null;
      let biomeLink: string | null = null;

      if (dec) {
        const biomeId = dec.biome.identifier;
        localizedName = dec.texts[0]?.name ?? e.name;
        imagePath = `/images/biomes/${biomeId}/decoration/${dec.identifier}/image.jpg`;
        biomeLink = `/biomes/${biomeId}`;
      } else if (game) {
        const biomeId = game.biomeIdentifier;
        localizedName = game.texts[0]?.name ?? e.name;
        imagePath = `/images/biomes/${biomeId}/game/${game.identifier}/image.jpg`;
        biomeLink = `/biomes/${biomeId}`;
      } else if (nameLower === "trough") {
        nameKey = "enclosure_trough";
        if (biome) {
          imagePath = `/images/biomes/${biome}/trough.jpg`;
          biomeLink = `/biomes/${biome}`;
        }
      } else if (nameLower === "water hole" || nameLower === "watering hole") {
        nameKey = "enclosure_waterhole";
        if (biome) {
          imagePath = `/images/biomes/${biome}/water_hole.jpg`;
          biomeLink = `/biomes/${biome}`;
        }
      } else if (nameLower === "shelter") {
        nameKey = "enclosure_shelter";
        if (biome) {
          imagePath = `/images/biomes/${biome}/shelter.png`;
          biomeLink = `/biomes/${biome}`;
        }
      }

      return {
        id: e.id,
        quantity: e.quantity,
        name: e.name,
        biomeIdentifier: e.biomeIdentifier,
        localizedName,
        nameKey,
        imagePath,
        biomeLink,
      };
    }),
    chests: r.chests.map((c) => ({
      id: c.id,
      quantity: c.quantity,
      chestType: c.chestType,
    })),
    animalRewards: r.animalRewards.map((a) => ({
      id: a.id,
      quantity: a.quantity,
      name: a.name,
      animal: a.animal
        ? {
            id: a.animal.id,
            identifier: a.animal.identifier,
            biomeIdentifier: a.animal.biome?.identifier ?? null,
            animalName: a.animal.animaltext[0]?.animalName ?? null,
          }
        : null,
    })),
  }));
}

export async function getAllAnimalsForLevelFilter(
  locale: string
): Promise<{ id: number; name: string; identifier: string }[]> {
  const animals = await prisma.animal.findMany({
    where: {
      levelRewards: { some: {} },
    },
    include: {
      animaltext: { where: { languageCode: locale } },
    },
    orderBy: { id: "asc" },
  });

  return animals
    .map((a) => ({
      id: a.id,
      identifier: a.identifier ?? "",
      name: a.animaltext[0]?.animalName ?? a.identifier ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
