import React from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllRegions } from "@/service/RegionService";
import ShopForm from "@/components/pages/zoo/shops/ShopForm";

interface CreateShopPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateShopPage({ params }: CreateShopPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/shops`);
  }

  const [regionsRaw, t] = await Promise.all([
    getAllRegions(locale),
    getTranslations({ locale, namespace: "shop" }),
  ]);

  const regions = regionsRaw.map((r: any) => ({
    id: r.id,
    identifier: r.identifier,
  }));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.create_shop")} />
        <ShopForm regions={regions} />
      </ContentWrapper>
    </PageWrapper>
  );
}
