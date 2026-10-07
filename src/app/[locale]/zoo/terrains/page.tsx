import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllTerrains } from "@/service/TerrainService";
import TerrainOverviewContent from "@/components/pages/zoo/terrains/TerrainOverviewContent";

export default async function TerrainOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [terrains, t] = await Promise.all([
    getAllTerrains(locale),
    getTranslations({ locale, namespace: "terrain" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <TerrainOverviewContent terrains={terrains} />
      </ContentWrapper>
    </PageWrapper>
  );
}
