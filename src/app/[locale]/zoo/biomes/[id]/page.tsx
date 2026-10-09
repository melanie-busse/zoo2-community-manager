import React from "react";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getBiomeById } from "@/service/BiomeService";
import BiomeDetailContent from "@/components/pages/zoo/biomes/BiomeDetailContent";

export default async function BiomeDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const biomeId = parseInt(id, 10);
  if (isNaN(biomeId)) notFound();

  const biome = await getBiomeById(biomeId, locale);
  if (!biome) notFound();

  const serialized = JSON.parse(JSON.stringify(biome));

  return (
    <PageWrapper>
      <ContentWrapper>
        <BiomeDetailContent biome={serialized} />
      </ContentWrapper>
    </PageWrapper>
  );
}
