import React from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import { getAllRegions } from "@/service/RegionService";
import { getBiomeByIdForEdit } from "@/service/BiomeService";
import BiomeForm from "@/components/pages/zoo/biomes/BiomeForm";

export default async function EditBiomePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const biomeId = parseInt(id, 10);
  if (isNaN(biomeId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/biomes`);
  }

  const [biome, languages, regions, t] = await Promise.all([
    getBiomeByIdForEdit(biomeId),
    getAllLanguages(),
    getAllRegions(locale),
    getTranslations({ locale, namespace: "biome" }),
  ]);

  if (!biome) notFound();

  const serialized = JSON.parse(JSON.stringify(biome));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_biome")} />
        <BiomeForm biome={serialized} languages={languages} regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
