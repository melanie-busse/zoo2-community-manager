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
import { getAllRegions } from "@/service/RegionService";
import { getAllBiomeGames } from "@/service/BiomeService";
import BiomeForm from "@/components/pages/zoo/biomes/BiomeForm";

export default async function CreateBiomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/biomes`);
  }

  const [languages, regions, allGames, t] = await Promise.all([
    getAllLanguages(),
    getAllRegions(locale),
    getAllBiomeGames(locale),
    getTranslations({ locale, namespace: "biome" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.create_biome")} />
        <BiomeForm languages={languages} regions={regions} allGames={JSON.parse(JSON.stringify(allGames))} />
      </ContentWrapper>
    </PageWrapper>
  );
}
