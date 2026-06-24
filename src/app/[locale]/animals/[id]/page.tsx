import React from "react";
import { notFound } from "next/navigation";

import AnimalDetailContentClient from "./AnimalDetailContentClient";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getAnimalById } from "@/service/AnimalService";

interface AnimalDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { id, locale } = await params;

  const animal = await getAnimalById(Number(id), locale);

  if (!animal) {
    notFound();
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <AnimalDetailContentClient animal={animal} />
      </ContentWrapper>
    </PageWrapper>
  );
}
