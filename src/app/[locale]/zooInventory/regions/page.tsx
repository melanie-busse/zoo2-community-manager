import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getRegionsWithInventory } from "@/service/RegionInventoryService";
import RegionInventoryContent from "@/components/pages/zooInventory/Regions/RegionInventoryContent";

export default async function RegionInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const userId = parseInt(session.user.id);

  const [data, t] = await Promise.all([
    getRegionsWithInventory(userId, locale),
    getTranslations({ locale, namespace: "region" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("inventory.title")} />
        <RegionInventoryContent data={data} />
      </ContentWrapper>
    </PageWrapper>
  );
}
