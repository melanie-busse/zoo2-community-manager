import "server-only";
import { prisma } from "@/lib/prisma";
import { Collection } from "@/types/collection";

export async function getAllCollections(locale: string): Promise<Collection[]> {
  const collections = await prisma.collection.findMany({
    include: {
      texts: { where: { languageCode: locale } },
      requirements: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ area: "asc" }, { stars: "asc" }, { id: "asc" }],
  });

  return collections.map((c) => ({
    id: c.id,
    identifier: c.identifier,
    stars: c.stars,
    area: c.area,
    name: c.texts[0]?.name ?? c.identifier,
    requirements: c.requirements.map((r) => ({
      id: r.id,
      type: r.type,
      requiredLevel: r.requiredLevel,
      itemName: r.itemName,
      sortOrder: r.sortOrder,
    })),
  }));
}
