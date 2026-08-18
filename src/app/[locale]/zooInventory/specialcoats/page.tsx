import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllSpecialCoats } from "@/service/SpecialCoatsService";
import SpecialCoatsInventoryClient from "@/app/[locale]/zooInventory/specialcoats/SpecialCoatsInventoryClient";

export default async function SpecialCoatsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const specialCoats = await getAllSpecialCoats(locale);

  return (
    <PageWrapper>
      <SpecialCoatsInventoryClient specialCoats={specialCoats} />
    </PageWrapper>
  );
}
