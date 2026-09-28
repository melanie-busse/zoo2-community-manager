import React from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import { getAllOrigins } from "@/service/OriginService";
import SpecialCoatForm from "@/components/pages/specialCoats/SpecialCoatForms/SpecialCoatsForm";
import { getAllAnimals } from "@/service/AnimalService";

interface CreateSpecialCoatPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateSpecialCoatPage({ params }: CreateSpecialCoatPageProps) {
  const { locale } = await params;

  const [allAnimals, languages, origins] = await Promise.all([
    getAllAnimals(locale),
    getAllLanguages(),
    getAllOrigins(locale),
  ]);

  const tSpecialCoat = await getTranslations({ locale, namespace: "specialCoat" });

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") && !isMayor(session)) {
    redirect(`/${locale}/animals`);
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tSpecialCoat("form.createSpecialCoat")} />

        <SpecialCoatForm animalData={allAnimals} languages={languages} originsData={origins} />
      </ContentWrapper>
    </PageWrapper>
  );
}
