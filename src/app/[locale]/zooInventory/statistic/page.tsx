import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getInventoryStatistics, getInventoryRegionStatistics } from "@/service/InventoryStatisticService";
import { getRegionStatistics } from "@/service/ZooStatisticService";
import { getCollectionCompletionStats } from "@/service/CollectionInventoryService";
import InventoryStatisticClient from "./InventoryStatisticClient";

export default async function InventoryStatisticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}`);
  }

  const userId = typeof session.user.id === "string"
    ? parseInt(session.user.id, 10)
    : session.user.id;

  const [biomeStatistics, collectionStats, inventoryRegionStats, totalRegionStats] = await Promise.all([
    getInventoryStatistics(userId, locale),
    getCollectionCompletionStats(userId, locale),
    getInventoryRegionStatistics(userId),
    getRegionStatistics(),
  ]);

  const regionStatistics = {
    ownedRegions: inventoryRegionStats.ownedRegions,
    ownedBreedingSlots: inventoryRegionStats.ownedBreedingSlots,
    totalRegions: totalRegionStats.totalRegions,
    totalBreedingSlots: totalRegionStats.totalBreedingSlots,
  };

  return (
    <PageWrapper>
      <InventoryStatisticClient biomeStatistics={biomeStatistics} collectionStats={collectionStats} regionStatistics={regionStatistics} />
    </PageWrapper>
  );
}