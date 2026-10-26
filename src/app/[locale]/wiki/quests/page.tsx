import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import QuestsFaqContent from "@/components/pages/wiki/quests/QuestsFaqContent";

export default async function QuestsFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "questsfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <QuestsFaqContent
          intro={t("intro")}
          typesTitle={t("types_title")}
          typesBody={t("types_body")}
          tutorialTitle={t("tutorial_title")}
          tutorialBody={t("tutorial_body")}
          levelTitle={t("level_title")}
          levelBody={t("level_body")}
          chainTitle={t("chain_title")}
          chainBody={t("chain_body")}
          featureTitle={t("feature_title")}
          featureBody={t("feature_body")}
          regionTitle={t("region_title")}
          regionBody={t("region_body")}
          miscTitle={t("misc_title")}
          miscBody={t("misc_body")}
          rewardsTitle={t("rewards_title")}
          rewardsBody={t("rewards_body")}
          tipsTitle={t("tips_title")}
          tipsTitleRetroactive={t("tips_title_retroactive")}
          tipsBodyRetroactive={t("tips_body_retroactive")}
          tipsTitleTimelimited={t("tips_title_timelimited")}
          tipsBodyTimelimited={t("tips_body_timelimited")}
          tipsTitleDiamonds={t("tips_title_diamonds")}
          tipsBodyDiamonds={t("tips_body_diamonds")}
          tipsTitlePuzzles={t("tips_title_puzzles")}
          tipsBodyPuzzles={t("tips_body_puzzles")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
