import React from "react";
import { notFound } from "next/navigation";

import SpecialCoatDetailClient from "./SpecialCoatDetailClient";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getSpecialCoatById } from "@/service/SpecialCoatsService";
import { getAnimalById } from "@/service/AnimalService";

interface SpecialCoatDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function SpecialCoatDetailPage({ params }: SpecialCoatDetailPageProps) {
  const { id, locale } = await params;

  const specialCoat = await getSpecialCoatById(id, locale);

  if (!specialCoat) {
    notFound();
  }

  const animal = await getAnimalById(specialCoat.animalId, locale);

  if (!animal) {
    notFound();
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <SpecialCoatDetailClient specialCoat={specialCoat} animal={animal} />
      </ContentWrapper>
    </PageWrapper>
  );
}