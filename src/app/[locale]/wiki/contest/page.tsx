import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import WikiContestContent from "@/components/pages/wiki/contest/WikiContestContent";

export default async function ContestFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contestfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <WikiContestContent
          intro={t("intro")}
          descriptionTitle={t("description_title")}
          descriptionP1={t("description_p1")}
          descriptionP2={t("description_p2")}
          descriptionP3={t("description_p3")}
          descriptionP4={t("description_p4")}
          newMembersTitle={t("new_members_title")}
          newMembersBody={t("new_members_body")}
          donationTitle={t("donation_title")}
          donationIntro={t("donation_intro")}
          contestPointsTitle={t("contest_points_title")}
          contestPointsBody={t("contest_points_body")}
          memberPointsTitle={t("member_points_title")}
          memberPointsBody={t("member_points_body")}
          rankBonusTitle={t("rank_bonus_title")}
          rankBonusIntro={t("rank_bonus_intro")}
          rewardsTitle={t("rewards_title")}
          rewardsBody={t("rewards_body")}
          statueRewardsTitle={t("statue_rewards_title")}
          specialCoatRewardsTitle={t("special_coat_rewards_title")}
          colRank={t("col_rank")}
          colMultiplier={t("col_multiplier")}
          colGuildExp={t("col_guild_exp")}
          colPuzzlePct={t("col_puzzle_pct")}
          colAnimalPurchases={t("col_animal_purchases")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
