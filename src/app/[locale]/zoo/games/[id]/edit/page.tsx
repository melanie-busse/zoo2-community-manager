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
import { getBiomeGameById } from "@/service/BiomeService";
import BiomeGameForm from "@/components/pages/zoo/games/BiomeGameForm";

export default async function EditBiomeGamePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const gameId = parseInt(id, 10);
  if (isNaN(gameId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/games`);
  }

  const [game, languages, t] = await Promise.all([
    getBiomeGameById(gameId),
    getAllLanguages(),
    getTranslations({ locale, namespace: "game" }),
  ]);

  if (!game) notFound();

  const serialized = JSON.parse(JSON.stringify(game));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_game")} />
        <BiomeGameForm game={serialized} languages={languages} />
      </ContentWrapper>
    </PageWrapper>
  );
}
