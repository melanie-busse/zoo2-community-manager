import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import WikiCollectionsContent from "@/components/pages/wiki/collections/WikiCollectionsContent";

export default async function WikiCollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wikicollections" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <WikiCollectionsContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          tiersTitle={t("tiers_title")}
          tiersBody={t("tiers_body")}
          tierOneTitle={t("tier_one_title")}
          tierOneBody={t("tier_one_body")}
          tierTwoTitle={t("tier_two_title")}
          tierTwoBody={t("tier_two_body")}
          tierThreeTitle={t("tier_three_title")}
          tierThreeBody={t("tier_three_body")}
          requirementsTitle={t("requirements_title")}
          requirementsBody={t("requirements_body")}
          regionsTitle={t("regions_title")}
          regionsBody={t("regions_body")}
          tipsTitle={t("tips_title")}
          tipsRetroactiveTitle={t("tips_retroactive_title")}
          tipsRetroactiveBody={t("tips_retroactive_body")}
          tipsPlanningTitle={t("tips_planning_title")}
          tipsPlanningBody={t("tips_planning_body")}
          tipsLevelTitle={t("tips_level_title")}
          tipsLevelBody={t("tips_level_body")}
          tipsClubTitle={t("tips_club_title")}
          tipsClubBody={t("tips_club_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
