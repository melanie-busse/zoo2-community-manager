/**
 * Links levelenclosureitem rows to biomedecoration / biomegame via English text match.
 * Run after migration 20261021020000_levelenclosure_decoration_fk.
 *
 * Usage: npx tsx scripts/link-enclosure-items.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PDF name → DB English name aliases
const NAME_ALIASES: Record<string, string> = {
  "stump": "Tree Stump",
  "trunk": "Tree Trunk",
  "maple tree": "Japanese Maple",
  "acacia": "Umbrella Acacia",
  "palm tree": "Small Palm Tree",
  "deco rock": "Decorative Rock",
  "small plum tree": "Small Palm Tree",
  "stone arch": "Stone Arch",
  "play rocks": "Play Rocks",
  "spruce": "Spruce",
};

async function main() {
  const items = await prisma.levelEnclosureItem.findMany({
    where: {
      biomeDecorationId: null,
      biomeGameId: null,
    },
  });

  console.log(`Found ${items.length} unlinked enclosure items`);

  const decorations = await prisma.biomeDecoration.findMany({
    include: {
      biome: { select: { identifier: true } },
      texts: { where: { languageCode: "en" } },
    },
  });

  const games = await prisma.biomeGame.findMany({
    include: {
      texts: { where: { languageCode: "en" } },
    },
  });

  let linkedDecoration = 0;
  let linkedGame = 0;
  let unlinked: string[] = [];

  for (const item of items) {
    const rawName = item.name.toLowerCase();
    const resolvedName = NAME_ALIASES[rawName] ?? item.name;
    const nameLower = resolvedName.toLowerCase();
    const biome = item.biomeIdentifier?.toLowerCase();

    // Try decorations first
    const dec = decorations.find((d) => {
      const textMatch = d.texts.some((t) => t.name.toLowerCase() === nameLower);
      const biomeMatch = !biome || d.biome.identifier.toLowerCase() === biome;
      return textMatch && biomeMatch;
    });

    if (dec) {
      await prisma.levelEnclosureItem.update({
        where: { id: item.id },
        data: { biomeDecorationId: dec.id },
      });
      console.log(`  [decoration] "${item.name}" (biome: ${item.biomeIdentifier}) → id=${dec.id} (${dec.identifier})`);
      linkedDecoration++;
      continue;
    }

    // Try games
    const game = games.find((g) => {
      const textMatch = g.texts.some((t) => t.name.toLowerCase() === nameLower);
      const biomeMatch = !biome || g.biomeIdentifier.toLowerCase() === biome;
      return textMatch && biomeMatch;
    });

    if (game) {
      await prisma.levelEnclosureItem.update({
        where: { id: item.id },
        data: { biomeGameId: game.id },
      });
      console.log(`  [game]       "${item.name}" (biome: ${item.biomeIdentifier}) → id=${game.id} (${game.identifier})`);
      linkedGame++;
      continue;
    }

    // Fuzzy fallback: ignore biome constraint
    const decFuzzy = decorations.find((d) =>
      d.texts.some((t) => t.name.toLowerCase() === nameLower)
    );
    if (decFuzzy) {
      await prisma.levelEnclosureItem.update({
        where: { id: item.id },
        data: { biomeDecorationId: decFuzzy.id },
      });
      console.log(`  [decoration-fuzzy] "${item.name}" (biome: ${item.biomeIdentifier}) → id=${decFuzzy.id} (${decFuzzy.identifier})`);
      linkedDecoration++;
      continue;
    }

    const gameFuzzy = games.find((g) =>
      g.texts.some((t) => t.name.toLowerCase() === nameLower)
    );
    if (gameFuzzy) {
      await prisma.levelEnclosureItem.update({
        where: { id: item.id },
        data: { biomeGameId: gameFuzzy.id },
      });
      console.log(`  [game-fuzzy] "${item.name}" (biome: ${item.biomeIdentifier}) → id=${gameFuzzy.id} (${gameFuzzy.identifier})`);
      linkedGame++;
      continue;
    }

    unlinked.push(`"${item.name}" (biome: ${item.biomeIdentifier})`);
  }

  console.log(`\nDone. Linked: ${linkedDecoration} decorations, ${linkedGame} games`);
  if (unlinked.length > 0) {
    console.log(`Unlinked (${unlinked.length}):`);
    unlinked.forEach((u) => console.log(`  ${u}`));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
