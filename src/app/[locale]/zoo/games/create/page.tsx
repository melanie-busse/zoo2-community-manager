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
import { getAllBiomesForOverview } from "@/service/BiomeService";
import BiomeGameForm from "@/components/pages/zoo/games/BiomeGameForm";

export default async function CreateBiomeGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/games`);
  }

  const [languages, biomes, t] = await Promise.all([
    getAllLanguages(),
    getAllBiomesForOverview(locale),
    getTranslations({ locale, namespace: "game" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.create_game")} />
        <BiomeGameForm languages={languages} biomes={JSON.parse(JSON.stringify(biomes))} />
      </ContentWrapper>
    </PageWrapper>
  );
}
