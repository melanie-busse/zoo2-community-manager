import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllTerrains(locale: string = "de") {
  return prisma.terrain.findMany({
    include: { terrainTexts: { where: { languageCode: locale } } },
    orderBy: { id: "asc" },
  });
}

export async function getTerrainByIdForEdit(id: number) {
  return prisma.terrain.findUnique({
    where: { id },
    include: { terrainTexts: true },
  });
}

export async function createTerrain(data: {
  identifier: string;
  terrainTexts: { languageCode: string; name: string }[];
}): Promise<{ id: number }> {
  const terrain = await prisma.terrain.create({
    data: {
      identifier: data.identifier,
      regionId: 0,
      terrainTexts: {
        createMany: {
          data: data.terrainTexts.filter((t) => t.name !== ""),
        },
      },
    },
  });
  return { id: terrain.id };
}

export async function updateTerrain(
  id: number,
  data: {
    identifier: string;
    terrainTexts: { languageCode: string; name: string }[];
  },
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.terrain.update({
      where: { id },
      data: { identifier: data.identifier },
    });
    await tx.terrainText.deleteMany({ where: { terrainid: id } });
    const validTexts = data.terrainTexts.filter((t) => t.name !== "");
    if (validTexts.length > 0) {
      await tx.terrainText.createMany({
        data: validTexts.map((t) => ({ terrainid: id, languageCode: t.languageCode, name: t.name })),
      });
    }
  });
}

export async function deleteTerrain(id: number): Promise<void> {
  await prisma.$transaction([
    prisma.terrainText.deleteMany({ where: { terrainid: id } }),
    prisma.terrain.delete({ where: { id } }),
  ]);
}
