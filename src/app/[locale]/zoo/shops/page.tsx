import React from "react";
import { getTranslations } from "next-intl/server";

import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllShops } from "@/service/ShopService";
import { getAllRegions } from "@/service/RegionService";
import ShopOverviewContent from "@/components/pages/zoo/shops/ShopOverviewContent";

interface ShopOverviewPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShopOverviewPage({ params }: ShopOverviewPageProps) {
  const { locale } = await params;

  const [shops, regions, t] = await Promise.all([
    getAllShops(locale),
    getAllRegions(locale),
    getTranslations({ locale, namespace: "shop" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <ShopOverviewContent
          shops={JSON.parse(JSON.stringify(shops))}
          regions={JSON.parse(JSON.stringify(regions))}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
