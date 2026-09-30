import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getCollectionsWithUserProgress } from "@/service/CollectionInventoryService";
import CollectionInventoryContent from "@/components/pages/zooInventory/collections/CollectionInventoryContent";

export default async function CollectionInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const userId = parseInt(session.user.id);

  const [data, t] = await Promise.all([
    getCollectionsWithUserProgress(locale, userId),
    getTranslations({ locale, namespace: "collections" }),
  ]);

  const regions = Array.from(
    new Map(data.map(({ collection: c }) => [c.region.id, c.region])).values()
  ).sort((a, b) => a.id - b.id);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("inventory_title")} />
        <CollectionInventoryContent data={data} regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
