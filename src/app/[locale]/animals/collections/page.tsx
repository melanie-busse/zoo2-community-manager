import React from "react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllCollections, getAllCollectionsForAdmin, getAllContestStatues } from "@/service/CollectionService";
import { getAllAnimals } from "@/service/AnimalService";
import { getAllRegions } from "@/service/RegionService";
import { hasMinimumRole } from "@/utils/roleUtils";
import CollectionsOverviewContent from "@/components/pages/animals/collections/CollectionsOverviewContent";

interface CollectionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { locale } = await params;
  const [collections, allAnimalsRaw, allStatues, allRegionsRaw, allRawCollections, session, t] = await Promise.all([
    getAllCollections(locale),
    getAllAnimals(locale),
    getAllContestStatues(),
    getAllRegions(locale),
    getAllCollectionsForAdmin(),
    getServerSession(authOptions),
    getTranslations({ locale, namespace: "collections" }),
  ]);

  const isAdmin = hasMinimumRole(session, "Director");

  const regions = Array.from(
    new Map(collections.map((c) => [c.region.id, c.region])).values(),
  ).sort((a, b) => a.id - b.id);

  const allAnimals = allAnimalsRaw.map((a: any) => ({
    id: a.id,
    identifier: a.identifier ?? "",
    name: a.animaltext?.[0]?.animalName ?? a.identifier ?? "",
  }));

  const allRegions = allRegionsRaw.map((r: any) => ({
    id: r.id,
    identifier: r.identifier ?? "",
    name: r.regionTexts?.[0]?.name ?? r.identifier ?? "",
  }));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <CollectionsOverviewContent
          collections={collections}
          regions={regions}
          isAdmin={isAdmin}
          allAnimals={allAnimals}
          allStatues={allStatues}
          allRegions={allRegions}
          allRawCollections={allRawCollections}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
