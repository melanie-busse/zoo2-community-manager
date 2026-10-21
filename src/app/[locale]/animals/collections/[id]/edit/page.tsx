import React from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllAnimals } from "@/service/AnimalService";
import { getAllRegions } from "@/service/RegionService";
import { getAllContestStatues, getAllSpecialCoatVariants, getCollectionForAdmin } from "@/service/CollectionService";
import CollectionForm from "@/components/pages/animals/collections/CollectionForm";

interface EditCollectionPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id, locale } = await params;
  const collectionId = parseInt(id, 10);

  if (isNaN(collectionId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/animals/collections`);
  }

  const [collection, allAnimalsRaw, allRegionsRaw, allStatues, allVariants, t] = await Promise.all([
    getCollectionForAdmin(collectionId),
    getAllAnimals(locale),
    getAllRegions(locale),
    getAllContestStatues(),
    getAllSpecialCoatVariants(locale),
    getTranslations({ locale, namespace: "collections" }),
  ]);

  if (!collection) notFound();

  const allAnimals = allAnimalsRaw
    .map((a: any) => ({
      id: a.id,
      identifier: a.identifier ?? "",
      name: a.animaltext?.[0]?.animalName ?? a.identifier ?? "",
      image:
        a.biome?.identifier && a.identifier
          ? `/images/animals/${a.biome.identifier}/${a.identifier}/image.jpg`
          : undefined,
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const allRegions = allRegionsRaw.map((r: any) => ({
    id: r.id,
    identifier: r.identifier ?? "",
    name: r.regionTexts?.[0]?.name ?? r.identifier ?? "",
  }));

  return (
    <PageWrapper>
      <div style={{ width: "100%", maxWidth: "1400px", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <PageHeader text={t("form.edit_title")} />
        <CollectionForm
          collection={collection}
          allAnimals={allAnimals}
          allStatues={allStatues}
          allRegions={allRegions}
          allVariants={allVariants}
        />
      </div>
    </PageWrapper>
  );
}
