import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllSpecialCoats } from "@/service/SpecialCoatsService";
import { getZooInventoryForUser } from "@/service/ZooInventoryService";
import SpecialCoatsInventoryClient from "@/app/[locale]/zooInventory/specialcoats/SpecialCoatsInventoryClient";

export default async function SpecialCoatsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const [specialCoats, userInventory] = await Promise.all([
    getAllSpecialCoats(locale),
    session?.user?.id ? getZooInventoryForUser(session.user.id) : Promise.resolve([]),
  ]);

  return (
    <PageWrapper>
      <SpecialCoatsInventoryClient specialCoats={specialCoats} userInventory={userInventory} />
    </PageWrapper>
  );
}
