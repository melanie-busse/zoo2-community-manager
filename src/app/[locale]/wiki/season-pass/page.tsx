import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import SeasonPassContent from "@/components/pages/wiki/season-pass/SeasonPassContent";

export default async function SeasonPassPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seasonpass" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <SeasonPassContent
          intro={t("intro")}
          tiersTitle={t("tiers_title")}
          tiersBody={t("tiers_body")}
          levelingTitle={t("leveling_title")}
          levelingBody={t("leveling_body")}
          xpTitle={t("xp_title")}
          xpBody={t("xp_body")}
          quizTitle={t("quiz_title")}
          quizBody={t("quiz_body")}
          questsTitle={t("quests_title")}
          questsBody={t("quests_body")}
          feathersTitle={t("feathers_title")}
          feathersBody={t("feathers_body")}
          feathersColBundle={t("feathers_col_bundle")}
          feathersColFeathers={t("feathers_col_feathers")}
          feathersColCost={t("feathers_col_cost")}
          scheduleTitle={t("schedule_title")}
          scheduleBody={t("schedule_body")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
