import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllSpecialCoats } from "@/service/SpecialCoatsService";
import { getZooInventoryForUser } from "@/service/ZooInventoryService";
import { getAllRegions } from "@/service/RegionService";
import SpecialCoatsInventoryClient from "@/app/[locale]/zooInventory/specialcoats/SpecialCoatsInventoryClient";

export default async function SpecialCoatsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const [specialCoats, userInventory, regions] = await Promise.all([
    getAllSpecialCoats(locale),
    session?.user?.id ? getZooInventoryForUser(session.user.id) : Promise.resolve([]),
    getAllRegions(locale),
  ]);

  return (
    <PageWrapper>
      <SpecialCoatsInventoryClient
        specialCoats={specialCoats}
        userInventory={userInventory}
        regions={regions}
      />
    </PageWrapper>
  );
}
