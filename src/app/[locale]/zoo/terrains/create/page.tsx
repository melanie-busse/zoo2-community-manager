import React from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import TerrainForm from "@/components/pages/zoo/terrains/TerrainForm";

export default async function CreateTerrainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/terrains`);
  }

  const [languages, t] = await Promise.all([
    getAllLanguages(),
    getTranslations({ locale, namespace: "terrain" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.create_terrain")} />
        <TerrainForm languages={languages} />
      </ContentWrapper>
    </PageWrapper>
  );
}
