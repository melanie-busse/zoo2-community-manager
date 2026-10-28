import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllChestBoosts } from "@/service/ChestBoostService";
import ChestBoostOverviewClient from "./ChestBoostOverviewClient";

export default async function ChestBoostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [boosts, t] = await Promise.all([
    getAllChestBoosts(locale),
    getTranslations({ locale, namespace: "chestBoosts" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <ChestBoostOverviewClient initialBoosts={boosts} />
      </ContentWrapper>
    </PageWrapper>
  );
}
