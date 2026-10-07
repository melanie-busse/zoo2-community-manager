import "server-only";
import { prisma } from "@/lib/prisma";

export async function getRegionCount() {
  return prisma.region.count();
}

export async function getTerrains(locale: string) {
  return prisma.terrain.findMany({
    include: { terrainTexts: { where: { languageCode: locale } } },
    orderBy: { id: "asc" },
  });
}

export async function getRegionById(id: number, locale: string = "de") {
  try {
    const region = await prisma.region.findUnique({
      where: { id },
      include: {
        regionTexts: { where: { languageCode: locale } },
        priceType: true,
        breedingCenters: true,
        breedingCenterSlots: { orderBy: { slot: "asc" } },
        admissionsBooths: { orderBy: { booth_level: "asc" } },
        adminBuildings: true,
        visitorCenters: true,
        transportStation: true,
        guestLounges: true,
        desingBoutique: true,
        clubHouse: true,
      },
    });
    if (!region) return null;

    const terrain = region.terrainid
      ? await prisma.terrain.findUnique({
          where: { id: region.terrainid },
          include: { terrainTexts: { where: { languageCode: locale } } },
        })
      : null;

    return { ...region, terrainName: terrain?.terrainTexts[0]?.name ?? null };
  } catch (error) {
    console.error(`[RegionService] Error in getRegionById (${id}, ${locale}):`, error);
    return null;
  }
}

export async function getRegionByIdForEdit(id: number) {
  try {
    return await prisma.region.findUnique({
      where: { id },
      include: {
        regionTexts: true,
        priceType: true,
        breedingCenters: true,
        breedingCenterSlots: { orderBy: { slot: "asc" } },
        admissionsBooths: { orderBy: { booth_level: "asc" } },
        adminBuildings: true,
        visitorCenters: true,
        transportStation: true,
        guestLounges: true,
      },
    });
  } catch (error) {
    console.error(`[RegionService] Error in getRegionByIdForEdit (${id}):`, error);
    return null;
  }
}

export async function createRegion(data: any): Promise<{ id: number }> {
  return prisma.$transaction(async (tx) => {
    const region = await tx.region.create({
      data: {
        price: parseInt(data.price || "0"),
        priceTypeId: parseInt(data.priceTypeId || "1"),
        terrainid: parseInt(data.terrainid || "0"),
        releasedate: new Date(data.releasedate),
        unlocklevel: parseInt(data.unlocklevel || "0"),
        identifier: data.identifier,
      },
    });

    const validTexts = (data.regionTexts ?? []).filter((t: any) => t.name !== "");
    if (validTexts.length > 0) {
      await tx.regionText.createMany({
        data: validTexts.map((t: any) => ({
          regionid: region.id,
          languageCode: t.languageCode,
          name: t.name,
        })),
      });
    }

    await tx.breedingCenter.create({
      data: {
        price: parseInt(data.breedingCenter?.price || "0"),
        pricetype: parseInt(data.breedingCenter?.pricetype || "1"),
        regionId: region.id,
      },
    });

    if ((data.breedingCenterSlots ?? []).length > 0) {
      await tx.breedingCenterSlot.createMany({
        data: data.breedingCenterSlots.map((s: any) => ({
          slot: parseInt(s.slot || "0"),
          price: parseInt(s.price || "0"),
          pricetype: parseInt(s.pricetype || "1"),
          regionId: region.id,
        })),
      });
    }

    if ((data.admissionsBooths ?? []).length > 0) {
      await tx.admissionsBooth.createMany({
        data: data.admissionsBooths.map((b: any) => ({
          booth_level: parseInt(b.booth_level || "0"),
          max_capacity: parseInt(b.max_capacity || "0"),
          upgrade: parseInt(b.upgrade || "0"),
          pricetype: parseInt(b.pricetype || "1"),
          regionId: region.id,
        })),
      });
    }

    await tx.adminBuilding.create({
      data: {
        price: parseInt(data.adminBuilding?.price || "0"),
        pricetype: parseInt(data.adminBuilding?.pricetype || "1"),
        regionId: region.id,
      },
    });

    await tx.visitorCenter.create({
      data: {
        price: parseInt(data.visitorCenter?.price || "0"),
        pricetype: parseInt(data.visitorCenter?.pricetype || "1"),
        regionId: region.id,
      },
    });

    await tx.transportStation.create({
      data: {
        price: parseInt(data.transportStation?.price || "0"),
        pricetype: parseInt(data.transportStation?.pricetype || "1"),
        regionId: region.id,
      },
    });

    if (data.hasGuestLounge) {
      await tx.guestLounge.create({
        data: {
          price: parseInt(data.guestLounge?.price || "0"),
          pricetype: parseInt(data.guestLounge?.pricetype || "1"),
          regionId: region.id,
        },
      });
    }

    return region;
  });
}

export async function updateRegion(id: number, data: any): Promise<{ id: number }> {
  return prisma.$transaction(async (tx) => {
    await tx.region.update({
      where: { id },
      data: {
        price: parseInt(data.price || "0"),
        priceTypeId: parseInt(data.priceTypeId || "1"),
        terrainid: parseInt(data.terrainid || "0"),
        releasedate: new Date(data.releasedate),
        unlocklevel: parseInt(data.unlocklevel || "0"),
        identifier: data.identifier,
      },
    });

    // regionTexts
    await tx.regionText.deleteMany({ where: { regionid: id } });
    const validTexts = (data.regionTexts ?? []).filter((t: any) => t.name !== "");
    if (validTexts.length > 0) {
      await tx.regionText.createMany({
        data: validTexts.map((t: any) => ({
          regionid: id,
          languageCode: t.languageCode,
          name: t.name,
        })),
      });
    }

    // breedingCenter
    await tx.breedingCenter.deleteMany({ where: { regionId: id } });
    await tx.breedingCenter.create({
      data: {
        price: parseInt(data.breedingCenter?.price || "0"),
        pricetype: parseInt(data.breedingCenter?.pricetype || "1"),
        regionId: id,
      },
    });

    // breedingCenterSlots
    await tx.breedingCenterSlot.deleteMany({ where: { regionId: id } });
    if ((data.breedingCenterSlots ?? []).length > 0) {
      await tx.breedingCenterSlot.createMany({
        data: data.breedingCenterSlots.map((s: any) => ({
          slot: parseInt(s.slot || "0"),
          price: parseInt(s.price || "0"),
          pricetype: parseInt(s.pricetype || "1"),
          regionId: id,
        })),
      });
    }

    // admissionsBooths
    await tx.admissionsBooth.deleteMany({ where: { regionId: id } });
    if ((data.admissionsBooths ?? []).length > 0) {
      await tx.admissionsBooth.createMany({
        data: data.admissionsBooths.map((b: any) => ({
          booth_level: parseInt(b.booth_level || "0"),
          max_capacity: parseInt(b.max_capacity || "0"),
          upgrade: parseInt(b.upgrade || "0"),
          pricetype: parseInt(b.pricetype || "1"),
          regionId: id,
        })),
      });
    }

    // adminBuilding
    await tx.adminBuilding.deleteMany({ where: { regionId: id } });
    await tx.adminBuilding.create({
      data: {
        price: parseInt(data.adminBuilding?.price || "0"),
        pricetype: parseInt(data.adminBuilding?.pricetype || "1"),
        regionId: id,
      },
    });

    // visitorCenter
    await tx.visitorCenter.deleteMany({ where: { regionId: id } });
    await tx.visitorCenter.create({
      data: {
        price: parseInt(data.visitorCenter?.price || "0"),
        pricetype: parseInt(data.visitorCenter?.pricetype || "1"),
        regionId: id,
      },
    });

    // transportStation
    await tx.transportStation.deleteMany({ where: { regionId: id } });
    await tx.transportStation.create({
      data: {
        price: parseInt(data.transportStation?.price || "0"),
        pricetype: parseInt(data.transportStation?.pricetype || "1"),
        regionId: id,
      },
    });

    // guestLounge — always delete, then recreate if toggled on
    await tx.guestLounge.deleteMany({ where: { regionId: id } });
    if (data.hasGuestLounge) {
      await tx.guestLounge.create({
        data: {
          price: parseInt(data.guestLounge?.price || "0"),
          pricetype: parseInt(data.guestLounge?.pricetype || "1"),
          regionId: id,
        },
      });
    }

    return { id };
  });
}

export async function deleteRegion(id: number): Promise<void> {
  await prisma.$transaction([
    prisma.regionText.deleteMany({ where: { regionid: id } }),
    prisma.admissionsBooth.deleteMany({ where: { regionId: id } }),
    prisma.breedingCenterSlot.deleteMany({ where: { regionId: id } }),
    prisma.breedingCenter.deleteMany({ where: { regionId: id } }),
    prisma.adminBuilding.deleteMany({ where: { regionId: id } }),
    prisma.visitorCenter.deleteMany({ where: { regionId: id } }),
    prisma.transportStation.deleteMany({ where: { regionId: id } }),
    prisma.guestLounge.deleteMany({ where: { regionId: id } }),
    prisma.region.delete({ where: { id } }),
  ]);
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