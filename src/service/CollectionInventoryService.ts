import "server-only";
import { prisma } from "@/lib/prisma";
import { Collection } from "@/types/collection";
import { getAllCollections } from "@/service/CollectionService";

export async function getCollectionsWithUserProgress(
  locale: string,
  userId: number
): Promise<{ collection: Collection; completedRequirementIds: Set<number> }[]> {
  const collections = await getAllCollections(locale);

  const allRequirementIds = collections.flatMap((c) =>
    c.requirements.map((r) => r.id)
  );

  const userProgress = await prisma.zooInventoryCollection.findMany({
    where: {
      userId,
      collectionRequirementId: { in: allRequirementIds },
      completed: true,
    },
    select: { collectionRequirementId: true },
  });

  const completedIds = new Set(userProgress.map((p) => p.collectionRequirementId));

  return collections.map((collection) => ({
    collection,
    completedRequirementIds: new Set(
      collection.requirements
        .filter((r) => completedIds.has(r.id))
        .map((r) => r.id)
    ),
  }));
}
