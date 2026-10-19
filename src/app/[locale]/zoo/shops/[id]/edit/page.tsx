import React from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getShopById } from "@/service/ShopService";
import { getAllRegions } from "@/service/RegionService";
import ShopForm from "@/components/pages/zoo/shops/ShopForm";

interface EditShopPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditShopPage({ params }: EditShopPageProps) {
  const { id, locale } = await params;
  const shopId = parseInt(id, 10);
  if (isNaN(shopId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/shops`);
  }

  const [shop, regionsRaw, t] = await Promise.all([
    getShopById(shopId),
    getAllRegions(locale),
    getTranslations({ locale, namespace: "shop" }),
  ]);

  if (!shop) notFound();

  const regions = regionsRaw.map((r: any) => ({
    id: r.id,
    identifier: r.identifier,
  }));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_shop")} />
        <ShopForm shop={JSON.parse(JSON.stringify(shop))} regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
