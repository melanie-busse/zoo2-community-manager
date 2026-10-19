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
import { getBiomeDecorationById, getAllBiomesForOverview } from "@/service/BiomeService";
import BiomeDecorationForm from "@/components/pages/zoo/decorations/BiomeDecorationForm";

export default async function EditBiomeDecorationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const decorationId = parseInt(id, 10);
  if (isNaN(decorationId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/decorations`);
  }

  const [decoration, languages, biomes, t] = await Promise.all([
    getBiomeDecorationById(decorationId),
    getAllLanguages(),
    getAllBiomesForOverview(locale),
    getTranslations({ locale, namespace: "decoration" }),
  ]);

  if (!decoration) notFound();

  const serialized = JSON.parse(JSON.stringify(decoration));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_decoration")} />
        <BiomeDecorationForm
          decoration={serialized}
          languages={languages}
          biomes={JSON.parse(JSON.stringify(biomes))}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
