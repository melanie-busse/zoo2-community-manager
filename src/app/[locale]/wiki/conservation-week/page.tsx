import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ConservationWeekContent from "@/components/pages/wiki/conservation-week/ConservationWeekContent";

export default async function ConservationWeekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "conservationweek" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <ConservationWeekContent
          intro={t("intro")}
          participationTitle={t("participation_title")}
          participationBody={t("participation_body")}
          tiersTitle={t("tiers_title")}
          tiersBody={t("tiers_body")}
          tiersHelper={t("tiers_helper")}
          tiersExpert={t("tiers_expert")}
          pointsTitle={t("points_title")}
          pointsBody={t("points_body")}
          tasksTitle={t("tasks_title")}
          tasksBody={t("tasks_body")}
          taskBreedBiome={t("task_breed_biome")}
          taskReleaseBiome={t("task_release_biome")}
          taskBreedList={t("task_breed_list")}
          taskReleaseList={t("task_release_list")}
          animalListTitle={t("animal_list_title")}
          animalListBody={t("animal_list_body")}
          questsTitle={t("quests_title")}
          questsBody={t("quests_body")}
          communityGoalTitle={t("community_goal_title")}
          communityGoalBody={t("community_goal_body")}
          personalRankingTitle={t("personal_ranking_title")}
          personalRankingBody={t("personal_ranking_body")}
          titlesTitle={t("titles_title")}
          titlesBody={t("titles_body")}
          fertilityFeedTitle={t("fertility_feed_title")}
          fertilityFeedBody={t("fertility_feed_body")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
