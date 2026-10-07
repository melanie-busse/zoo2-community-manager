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
import { getTerrains } from "@/service/RegionService";
import RegionForm from "@/components/pages/zoo/regions/RegionForm";

interface CreateRegionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateRegionPage({ params }: CreateRegionPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") && !isMayor(session)) {
    redirect(`/${locale}/zoo/regions`);
  }

  const [languages, terrains] = await Promise.all([getAllLanguages(), getTerrains(locale)]);

  const tRegion = await getTranslations({ locale, namespace: "region" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tRegion("form.create_region")} />
        <RegionForm languages={languages} terrains={terrains} />
      </ContentWrapper>
    </PageWrapper>
  );
}
