import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllRegions } from "@/service/RegionService";
import { getTranslations } from "next-intl/server";
import RegionOverviewContent from "@/components/pages/zoo/regions/RegionOverviewContent";

export default async function RegionOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [regions, t] = await Promise.all([
    getAllRegions(locale),
    getTranslations({ locale, namespace: "region" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <RegionOverviewContent regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
