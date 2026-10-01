import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ZooStatisticClient from "@/app/[locale]/zoo/statistic/ZooStatisticClient";
import { getZooStatistics, getTotalCollectionCount } from "@/service/ZooStatisticService";

export default async function ZooStatisticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [biomeStatistics, totalCollections] = await Promise.all([
    getZooStatistics(locale),
    getTotalCollectionCount(),
  ]);

  return (
    <PageWrapper>
      <ZooStatisticClient biomeStatistics={biomeStatistics} totalCollections={totalCollections} />
    </PageWrapper>
  );
}
