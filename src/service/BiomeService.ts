import "server-only";
import prisma from "@/lib/prisma";
export async function getHabitatCount() {
  return prisma.biome.count();
}

export async function getAllBiomes(locale: string = "de") {
  try {
    return await prisma.biome.findMany({
      include: {
        biomestext: locale ? { where: { languageCode: locale } } : true,
      },
      orderBy: {
        identifier: "asc",
      },
    });
  } catch (error) {
    console.error("Fehler im BiomeService:", error);
    return [];
  }
}
