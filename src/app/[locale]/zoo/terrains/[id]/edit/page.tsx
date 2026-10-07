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
import { getTerrainByIdForEdit } from "@/service/TerrainService";
import TerrainForm from "@/components/pages/zoo/terrains/TerrainForm";

export default async function EditTerrainPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const terrainId = parseInt(id, 10);
  if (isNaN(terrainId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/terrains`);
  }

  const [terrain, languages, t] = await Promise.all([
    getTerrainByIdForEdit(terrainId),
    getAllLanguages(),
    getTranslations({ locale, namespace: "terrain" }),
  ]);

  if (!terrain) notFound();

  const serialized = JSON.parse(JSON.stringify(terrain));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_terrain")} />
        <TerrainForm terrain={serialized} languages={languages} />
      </ContentWrapper>
    </PageWrapper>
  );
}
