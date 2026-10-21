import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLevelRewards, getAllAnimalsForLevelFilter } from "@/service/LevelService";
import LevelUpOverviewContent from "@/components/pages/game/levelup/LevelUpOverviewContent";

export default async function LevelUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [levels, allAnimals, t] = await Promise.all([
    getAllLevelRewards(locale),
    getAllAnimalsForLevelFilter(locale),
    getTranslations({ locale, namespace: "levelup" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <LevelUpOverviewContent levels={levels} allAnimals={allAnimals} />
      </ContentWrapper>
    </PageWrapper>
  );
}
