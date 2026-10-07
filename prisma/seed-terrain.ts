import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const terrains = [
  {
    identifier: "grass",
    regionIdentifier: "MainZoo",
    texts: { de: "Gras", en: "Grass", da: "Græs", nl: "Gras", es: "Hierba", fr: "Herbe" },
  },
  {
    identifier: "forest",
    regionIdentifier: "FirGrove",
    texts: { de: "Wald", en: "Forest", da: "Skov", nl: "Bos", es: "Bosque", fr: "Forêt" },
  },
  {
    identifier: "savanna",
    regionIdentifier: "KujaliPark",
    texts: { de: "Savanne", en: "Savanna", da: "Savanne", nl: "Savanne", es: "Sabana", fr: "Savane" },
  },
  {
    identifier: "water",
    regionIdentifier: "OceansideZoo",
    texts: { de: "Wasser", en: "Water", da: "Vand", nl: "Water", es: "Agua", fr: "Eau" },
  },
  {
    identifier: "ice",
    regionIdentifier: "PolarPark",
    texts: { de: "Eis", en: "Ice", da: "Is", nl: "Ijs", es: "Hielo", fr: "Glace" },
  },
  {
    identifier: "jungle",
    regionIdentifier: "RainforestPark",
    texts: { de: "Dschungel", en: "Jungle", da: "Jungle", nl: "Jungle", es: "Selva", fr: "Jungle" },
  },
];

async function main() {
  for (const terrainData of terrains) {
    const region = await prisma.region.findFirst({
      where: { identifier: terrainData.regionIdentifier },
    });

    const terrain = await prisma.terrain.create({
      data: {
        regionId: region?.id ?? 0,
        identifier: terrainData.identifier,
        terrainTexts: {
          createMany: {
            data: Object.entries(terrainData.texts).map(([code, name]) => ({
              languageCode: code,
              name,
            })),
          },
        },
      },
    });

    if (region) {
      await prisma.region.update({
        where: { id: region.id },
        data: { terrainid: terrain.id },
      });
    }

    console.log(`Created terrain: ${terrainData.identifier} (id: ${terrain.id})${region ? ` → assigned to region ${region.identifier}` : ""}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
