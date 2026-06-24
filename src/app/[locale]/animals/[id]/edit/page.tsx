import React from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";

import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getAnimalById } from "@/service/AnimalService";
import { getAllBiomes } from "@/service/BiomeService";
import { getAllOrigins } from "@/service/OriginService";
import { getAllLanguages } from "@/service/LanguageService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AnimalForm from "@/components/pages/animals/AnimalForms/AnimalForm";
import PageHeader from "@/components/page-structure/page/PageHeader";

interface EditAnimalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EditAnimalPage({ params }: EditAnimalPageProps) {
  const { id, locale } = await params;

  const [animalRaw, languages, biomes, origins] = await Promise.all([
    getAnimalById(id),
    getAllLanguages(),
    getAllBiomes(),
    getAllOrigins(),
  ]);

  if (!animalRaw) {
    notFound();
  }

  const serializedAnimal = JSON.parse(JSON.stringify(animalRaw));

  const tAnimals = await getTranslations({ locale, namespace: "Animals" });

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Director") {
    redirect(`/${locale}/animals`);
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tAnimals("form.editAnimal")} />

        <AnimalForm
          animal={serializedAnimal}
          languages={languages}
          biomes={biomes as any}
          originsData={origins}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
