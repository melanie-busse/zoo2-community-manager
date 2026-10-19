import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllOriginsForOverview } from "@/service/OriginService";
import { getTranslations } from "next-intl/server";
import OriginOverviewContent from "@/components/pages/zoo/origins/OriginOverviewContent";

export default async function OriginOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [origins, t] = await Promise.all([
    getAllOriginsForOverview(locale),
    getTranslations({ locale, namespace: "origin" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <OriginOverviewContent origins={JSON.parse(JSON.stringify(origins))} />
      </ContentWrapper>
    </PageWrapper>
  );
}
