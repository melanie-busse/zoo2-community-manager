import "server-only";
import { prisma } from "@/lib/prisma";

export type LevelRewardItem = {
  id: number;
  level: number;
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
