import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ZooStatisticClient from "@/app/[locale]/zoo/statistic/ZooStatisticClient";
import { getZooStatistics } from "@/service/ZooStatisticService";

export default async function ZooStatisticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const biomeStatistics = await getZooStatistics(locale);

  return (
    <PageWrapper>
      <ZooStatisticClient biomeStatistics={biomeStatistics} />
    </PageWrapper>
  );
}
