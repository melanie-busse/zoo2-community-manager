import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import PrizeWheelContent from "@/components/pages/wiki/prize-wheel/PrizeWheelContent";

export default async function PrizeWheelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prizewheel" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <PrizeWheelContent
          intro={t("intro")}
          howItWorksTitle={t("how_it_works_title")}
          howItWorksBody={t("how_it_works_body")}
          rewardsTitle={t("rewards_title")}
          rewardsBody={t("rewards_body")}
          rewardsListTitle={t("rewards_list_title")}
          rewardCoinChest={t("reward_coin_chest")}
          rewardTickets={t("reward_tickets")}
          rewardEnergy={t("reward_energy")}
          rewardCoinsSmall={t("reward_coins_small")}
          rewardCoinsLarge={t("reward_coins_large")}
          rewardExclusive={t("reward_exclusive")}
          timerTitle={t("timer_title")}
          timerBody={t("timer_body")}
          timerColSpins={t("timer_col_spins")}
          timerColTimer={t("timer_col_timer")}
          resetTitle={t("reset_title")}
          resetBody={t("reset_body")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
