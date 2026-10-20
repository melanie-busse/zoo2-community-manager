import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllShops(locale?: string) {
  return prisma.regionShop.findMany({
    include: {
      levels: { orderBy: { level: "asc" } },
      region: {
        include: {
          regionTexts: locale
            ? { where: { languageCode: locale } }
            : false,
        },
      },
      texts: locale ? { where: { languageCode: locale } } : false,
    },
    orderBy: { name: "asc" },
  });
}

export async function getShopById(id: number) {
  return prisma.regionShop.findUnique({
    where: { id },
    include: {
      levels: { orderBy: { level: "asc" } },
      region: true,
    },
  });
}

export async function createShop(data: any): Promise<{ id: number }> {
  return prisma.$transaction(async (tx) => {
    const shop = await tx.regionShop.create({
      data: {
        name: data.name,
        identifier: data.identifier ?? "",
        coinsPerClient: data.coinsPerClient != null ? parseInt(data.coinsPerClient) : null,
        regionId: data.regionId ? parseInt(data.regionId) : null,
      },
    });

    if ((data.levels ?? []).length > 0) {
      await tx.regionShopLevel.createMany({
        data: data.levels.map((l: any, i: number) => ({
          shopId: shop.id,
          level: i,
          cost: parseInt(l.cost) || 0,
          currency: l.currency || "COINS",
          maxCapacity: parseInt(l.maxCapacity) || 0,
          buildTime: l.buildTime || "",
        })),
      });
    }

    return shop;
  });
}

export async function updateShop(id: number, data: any): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.regionShop.update({
      where: { id },
      data: {
        name: data.name,
        coinsPerClient: data.coinsPerClient != null ? parseInt(data.coinsPerClient) : null,
        regionId: data.regionId ? parseInt(data.regionId) : null,
      },
    });

    await tx.regionShopLevel.deleteMany({ where: { shopId: id } });

    if ((data.levels ?? []).length > 0) {
      await tx.regionShopLevel.createMany({
        data: data.levels.map((l: any, i: number) => ({
          shopId: id,
          level: i,
          cost: parseInt(l.cost) || 0,
          currency: l.currency || "COINS",
          maxCapacity: parseInt(l.maxCapacity) || 0,
          buildTime: l.buildTime || "",
        })),
      });
    }
  });
}

export async function deleteShop(id: number): Promise<void> {
  await prisma.regionShop.delete({ where: { id } });
}
