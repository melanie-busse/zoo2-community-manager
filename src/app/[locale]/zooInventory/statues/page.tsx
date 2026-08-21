import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllContestAnimals } from "@/service/AnimalService";
import { getZooInventoryStatuesForUser } from "@/service/ZooInventoryService";
import { getAllRegions } from "@/service/RegionService";
import StatueInventoryClient from "@/app/[locale]/zooInventory/statues/StatueInventoryClient";

export default async function StatueInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const [statues, userInventory, regions] = await Promise.all([
    getAllContestAnimals(locale),
    session?.user?.id ? getZooInventoryStatuesForUser(session.user.id) : Promise.resolve([]),
    getAllRegions(locale),
  ]);

  return (
    <PageWrapper>
      <StatueInventoryClient statues={statues} userInventory={userInventory} regions={regions} />
    </PageWrapper>
  );
}
