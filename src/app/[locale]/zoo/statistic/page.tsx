import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ZooStatisticClient from "@/app/[locale]/zoo/statistic/ZooStatisticClient";
import { getZooStatistics, getTotalCollectionCount, getRegionStatistics } from "@/service/ZooStatisticService";

export default async function ZooStatisticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [biomeStatistics, totalCollections, regionStatistics] = await Promise.all([
    getZooStatistics(locale),
    getTotalCollectionCount(),
    getRegionStatistics(),
  ]);

  return (
    <PageWrapper>
      <ZooStatisticClient
        biomeStatistics={biomeStatistics}
        totalCollections={totalCollections}
        regionStatistics={regionStatistics}
      />
    </PageWrapper>
  );
}
