import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getContestSpecialCoats } from "@/service/ContestService";
import { getZooInventoryContestSpecialCoatsForUser } from "@/service/ZooInventoryService";
import { getAllRegions } from "@/service/RegionService";
import ContestSpecialCoatInventoryClient from "@/app/[locale]/zooInventory/contestSpecialCoats/ContestSpecialCoatInventoryClient";

export default async function ContestSpecialCoatInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const [coats, userInventory, regions] = await Promise.all([
    getContestSpecialCoats(locale),
    session?.user?.id
      ? getZooInventoryContestSpecialCoatsForUser(session.user.id)
      : Promise.resolve([]),
    getAllRegions(locale),
  ]);

  return (
    <PageWrapper>
      <ContestSpecialCoatInventoryClient
        coats={coats}
        userInventory={userInventory}
        regions={regions}
      />
    </PageWrapper>
  );
}
