import React from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import { getAllOrigins } from "@/service/OriginService";
import SpecialCoatsForm from "@/components/pages/specialCoats/SpecialCoatForms/SpecialCoatsForm";

import { getSpecialCoatById } from "@/service/SpecialCoatsService";
import { getAllAnimals } from "@/service/AnimalService";

interface EditSpecialCoatPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditSpecialCoatPage({ params }: EditSpecialCoatPageProps) {
  const { locale, id } = await params;
  const coatId = parseInt(id, 10);

  if (isNaN(coatId)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Director") {
    redirect(`/${locale}/specialcoats`);
  }

  const [specialCoat, languages, animals, origins] = await Promise.all([
    getSpecialCoatById(id),
    getAllLanguages(),
    getAllAnimals(locale),
    getAllOrigins(),
  ]);

  if (!specialCoat) {
    notFound();
  }

  const tSpecialCoat = await getTranslations({ locale, namespace: "SpecialCoat" });

  const preparedSpecialCoat = {
    ...specialCoat,
    releaseDate: specialCoat.releaseDate
      ? new Date(specialCoat.releaseDate).toISOString().split("T")[0]
      : "",
    specialcoatsorigin: specialCoat.specialcoatsorigin,
    specialcoatstext: specialCoat.specialcoatstext,
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tSpecialCoat("form.editSpecialCoat")} />

        <SpecialCoatsForm
          animalData={animals}
          languages={languages}
          originsData={origins}
          specialCoat={preparedSpecialCoat}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
