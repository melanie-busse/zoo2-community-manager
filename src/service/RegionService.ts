import "server-only";
import { prisma } from "@/lib/prisma";

export async function getRegionCount() {
  return prisma.region.count();
}

export async function getRegionById(id: number, locale: string = "de") {
  try {
    return await prisma.region.findUnique({
      where: { id },
      include: {
        regionTexts: { where: { languageCode: locale } },
        priceType: true,
      },
    });
  } catch (error) {
    console.error(`[RegionService] Error in getRegionById (${id}, ${locale}):`, error);
    return null;
  }
}

export async function getAllRegions(locale: string = "de") {
  try {
    return await prisma.region.findMany({
      include: {
        regionTexts: { where: { languageCode: locale } },
        _count: { select: { breedingCenterSlots: true } },
      },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error(`[RegionService] Error in getAllRegions (${locale}):`, error);
    return [];
  }
}