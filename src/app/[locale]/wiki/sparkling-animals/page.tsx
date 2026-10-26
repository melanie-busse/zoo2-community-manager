import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import SparklingAnimalsContent from "@/components/pages/wiki/sparkling-animals/SparklingAnimalsContent";

export default async function SparklingAnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sparklinganimals" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <SparklingAnimalsContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          streakTitle={t("streak_title")}
          streakBody={t("streak_body")}
          chancesTitle={t("chances_title")}
          chancesBody={t("chances_body")}
          colStreak={t("col_streak")}
          colOdds={t("col_odds")}
          colChance={t("col_chance")}
          breedingWithTitle={t("breeding_with_title")}
          breedingWithBody={t("breeding_with_body")}
          donatingTitle={t("donating_title")}
          donatingBody={t("donating_body")}
          glowTitle={t("glow_title")}
          glowBody={t("glow_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
