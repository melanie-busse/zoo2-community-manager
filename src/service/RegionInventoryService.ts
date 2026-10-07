import "server-only";
import { prisma } from "@/lib/prisma";

export type RegionInventoryField =
  | "owned"
  | "breedingCenterSlots"
  | "admissionsBoothLevel"
  | "adminBuilding"
  | "visitorCenter"
  | "transportStation"
  | "guestLounge"
  | "desingBoutique"
  | "clubHouse";

export interface RegionInventoryData {
  owned: boolean;
  breedingCenterSlots: number | null;
  admissionsBoothLevel: number | null;
  adminBuilding: boolean;
  visitorCenter: boolean;
  transportStation: boolean;
  guestLounge: boolean;
  desingBoutique: boolean;
  clubHouse: boolean;
}

export async function getRegionsWithInventory(userId: number, locale: string) {
  const [regions, inventoryRows] = await Promise.all([
    prisma.region.findMany({
      include: {
        regionTexts: { where: { languageCode: locale } },
        breedingCenterSlots: true,
        admissionsBooths: { orderBy: { booth_level: "asc" } },
        guestLounges: true,
        desingBoutique: true,
        clubHouse: true,
      },
      orderBy: { id: "asc" },
    }),
    prisma.zooInventoryRegion.findMany({ where: { userid: userId } }),
  ]);

  const inventoryMap = new Map(inventoryRows.map((r) => [r.regionId, r]));

  return regions.map((region) => {
    const row = inventoryMap.get(region.id) ?? null;
    return {
      region,
      inventory: row
        ? {
            owned: row.owned,
            breedingCenterSlots: row.breedingCenterSlots,
            admissionsBoothLevel: row.admissionsBoothLevel,
            adminBuilding: row.adminBuilding,
            visitorCenter: row.visitorCenter,
            transportStation: row.transportStation,
            guestLounge: row.guestLounge,
            desingBoutique: row.desingBoutique,
            clubHouse: row.clubHouse,
          }
        : null,
    };
  });
}

export async function upsertRegionInventory(
  userId: number,
  regionId: number,
  field: RegionInventoryField,
  value: boolean | number | null,
): Promise<void> {
  const boolFields = ["owned", "adminBuilding", "visitorCenter", "transportStation", "guestLounge", "desingBoutique", "clubHouse"];
  const intFields = ["breedingCenterSlots", "admissionsBoothLevel"];

  const parsedValue = intFields.includes(field)
    ? value === null ? null : Number(value)
    : Boolean(value);

  await prisma.zooInventoryRegion.upsert({
    where: { userid_regionId: { userid: userId, regionId } },
    update: { [field]: parsedValue },
    create: {
      userid: userId,
      regionId,
      owned: field === "owned" ? Boolean(value) : false,
      breedingCenterSlots: field === "breedingCenterSlots" ? (value === null ? null : Number(value)) : null,
      admissionsBoothLevel: field === "admissionsBoothLevel" ? (value === null ? null : Number(value)) : null,
      adminBuilding: field === "adminBuilding" ? Boolean(value) : false,
      visitorCenter: field === "visitorCenter" ? Boolean(value) : false,
      transportStation: field === "transportStation" ? Boolean(value) : false,
      guestLounge: field === "guestLounge" ? Boolean(value) : false,
      desingBoutique: field === "desingBoutique" ? Boolean(value) : false,
      clubHouse: field === "clubHouse" ? Boolean(value) : false,
    },
  });
}
