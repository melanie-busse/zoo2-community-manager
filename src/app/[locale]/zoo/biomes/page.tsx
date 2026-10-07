import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllBiomesForOverview } from "@/service/BiomeService";
import BiomeOverviewContent from "@/components/pages/zoo/biomes/BiomeOverviewContent";

export default async function BiomeOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [biomes, t] = await Promise.all([
    getAllBiomesForOverview(locale),
    getTranslations({ locale, namespace: "biome" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <BiomeOverviewContent biomes={biomes} />
      </ContentWrapper>
    </PageWrapper>
  );
}
