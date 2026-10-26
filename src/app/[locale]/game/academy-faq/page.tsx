import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import AcademyFaqContent from "@/components/pages/game/academyfaq/AcademyFaqContent";

export default async function AcademyFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "academyfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <AcademyFaqContent
          intro={t("intro")}
          membershipTitle={t("membership_title")}
          membershipBody={t("membership_body")}
          stampsTitle={t("stamps_title")}
          stampsBody={t("stamps_body")}
          masteryTitle={t("mastery_title")}
          masteryBody={t("mastery_body")}
          tasksTitle={t("tasks_title")}
          tasksBody={t("tasks_body")}
          tipsTitle={t("tips_title")}
          tipsIntro={t("tips_intro")}
          tip1={t("tip_1")}
          tip2={t("tip_2")}
          tip3={t("tip_3")}
          tip4={t("tip_4")}
          tip5={t("tip_5")}
          colMembership={t("col_membership")}
          colDuration={t("col_duration")}
          colStartup={t("col_startup")}
          colExtend={t("col_extend")}
          colStamps={t("col_stamps")}
          colCostPerStamp={t("col_cost_per_stamp")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
