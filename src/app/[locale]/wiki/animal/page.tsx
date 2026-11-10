import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import AnimalTradesContent from "@/components/pages/wiki/animal-package-trades/AnimalTradesContent";

export default async function AnimalTradesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "animaltrades" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <AnimalTradesContent
          intro={t("intro")}
          bonusTitle={t("bonus_title")}
          bonusBody={t("bonus_body")}
          howTitle={t("how_title")}
          howStep1={t("how_step1")}
          howStep2={t("how_step2")}
          howStep3={t("how_step3")}
          howStep4={t("how_step4")}
          exclusionsTitle={t("exclusions_title")}
          exclusionsBody={t("exclusions_body")}
          exclusionsRulesTitle={t("exclusions_rules_title")}
          exclusionPremium={t("exclusion_premium")}
          exclusionPairs={t("exclusion_pairs")}
          exclusionList={t("exclusion_list")}
          exclusionEnclosure={t("exclusion_enclosure")}
          tradelistTitle={t("tradelist_title")}
          tradelistBody={t("tradelist_body")}
          tradelistTip={t("tradelist_tip")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
