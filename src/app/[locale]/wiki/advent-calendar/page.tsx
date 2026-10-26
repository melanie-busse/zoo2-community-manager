import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import AdventCalendarContent from "@/components/pages/wiki/advent-calendar/AdventCalendarContent";

export default async function AdventCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "adventcalendar" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <AdventCalendarContent
          intro={t("intro")}
          howItWorksTitle={t("how_it_works_title")}
          howItWorksBody={t("how_it_works_body")}
          rewardsTitle={t("rewards_title")}
          rewardsBody={t("rewards_body")}
          colDay={t("col_day")}
          colReward={t("col_reward")}
          year2025={t("year_2025")}
          year2024={t("year_2024")}
          year2023={t("year_2023")}
          year2022={t("year_2022")}
          year2021={t("year_2021")}
          year2020={t("year_2020")}
          year2019={t("year_2019")}
          year2018={t("year_2018")}
          summary2025={t("summary_2025")}
          summary2024={t("summary_2024")}
          summary2023={t("summary_2023")}
          summary2022={t("summary_2022")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
