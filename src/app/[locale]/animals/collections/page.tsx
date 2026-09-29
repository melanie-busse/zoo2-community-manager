import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllCollections } from "@/service/CollectionService";
import CollectionsOverviewContent from "@/components/pages/collections/CollectionsOverviewContent";

interface CollectionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { locale } = await params;
  const [collections, t] = await Promise.all([
    getAllCollections(locale),
    getTranslations({ locale, namespace: "collections" }),
  ]);

  const regions = Array.from(
    new Map(collections.map((c) => [c.region.id, c.region])).values(),
  ).sort((a, b) => a.id - b.id);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <CollectionsOverviewContent collections={collections} regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
