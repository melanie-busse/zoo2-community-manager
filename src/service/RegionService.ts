import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllRegions(locale: string = "de") {
  try {
    return await prisma.region.findMany({
      include: {
        regionTexts: { where: { languageCode: locale } },
      },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error(`[RegionService] Error in getAllRegions (${locale}):`, error);
    return [];
  }
}