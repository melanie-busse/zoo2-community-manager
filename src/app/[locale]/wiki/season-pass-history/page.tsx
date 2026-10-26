import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import SeasonPassHistoryContent from "@/components/pages/wiki/season-pass-history/SeasonPassHistoryContent";

export default async function SeasonPassHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seasonpasshistory" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <SeasonPassHistoryContent
          intro={t("intro")}
          colSeason={t("col_season")}
          colStart={t("col_start")}
          colStandard={t("col_standard")}
          colPremium={t("col_premium")}
          colVip={t("col_vip")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
