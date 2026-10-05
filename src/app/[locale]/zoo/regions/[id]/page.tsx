import React from "react";
import { notFound } from "next/navigation";

import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getRegionById } from "@/service/RegionService";
import RegionDetailContent from "@/components/pages/zoo/regions/RegionDetailContent";

interface RegionDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function RegionDetailPage({ params }: RegionDetailPageProps) {
  const { id, locale } = await params;

  const region = await getRegionById(Number(id), locale);

  if (!region) {
    notFound();
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <RegionDetailContent region={region} />
      </ContentWrapper>
    </PageWrapper>
  );
}
