import React from "react";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import { getShopById } from "@/service/ShopService";
import ShopDetailContent from "@/components/pages/zoo/shops/ShopDetailContent";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const shopId = parseInt(id, 10);
  if (isNaN(shopId)) notFound();

  const shop = await getShopById(shopId, locale);
  if (!shop) notFound();

  return (
    <PageWrapper>
      <ContentWrapper>
        <ShopDetailContent shop={JSON.parse(JSON.stringify(shop))} />
      </ContentWrapper>
    </PageWrapper>
  );
}
