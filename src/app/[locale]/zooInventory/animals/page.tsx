import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllAnimals } from "@/service/AnimalService";
import { getZooInventoryAnimalsForUser } from "@/service/ZooInventoryService";
import { getAllRegions } from "@/service/RegionService";
import AnimalInventoryClient from "@/app/[locale]/zooInventory/animals/AnimalInventoryClient";

export default async function AnimalInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const [animals, userInventory, regions] = await Promise.all([
    getAllAnimals(locale),
    session?.user?.id ? getZooInventoryAnimalsForUser(session.user.id) : Promise.resolve([]),
    getAllRegions(locale),
  ]);

  return (
    <PageWrapper>
      <AnimalInventoryClient animals={animals} userInventory={userInventory} regions={regions} />
    </PageWrapper>
  );
}