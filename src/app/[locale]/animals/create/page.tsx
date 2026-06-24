import React from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import { getAllBiomes } from "@/service/BiomeService";
import { getAllOrigins } from "@/service/OriginService";
import AnimalForm from "@/components/pages/animals/AnimalForms/AnimalForm";

interface CreateAnimalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateAnimalPage({ params }: CreateAnimalPageProps) {
  const { locale } = await params;

  const [languages, biomes, origins] = await Promise.all([
    getAllLanguages(),
    getAllBiomes(locale),
    getAllOrigins(),
  ]);

  const tAnimals = await getTranslations({ locale, namespace: "Animals" });

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Director") {
    redirect(`/${locale}/animals`);
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tAnimals("form.createAnimal")} />

        <AnimalForm languages={languages} biomes={biomes as any} originsData={origins} />
      </ContentWrapper>
    </PageWrapper>
  );
}
