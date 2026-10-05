import React from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";

import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getRegionByIdForEdit } from "@/service/RegionService";
import { getAllLanguages } from "@/service/LanguageService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import RegionForm from "@/components/pages/zoo/regions/RegionForm";

interface EditRegionPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditRegionPage({ params }: EditRegionPageProps) {
  const { id, locale } = await params;
  const regionId = parseInt(id, 10);

  if (isNaN(regionId)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") && !isMayor(session)) {
    redirect(`/${locale}/zoo/regions`);
  }

  const [regionRaw, languages] = await Promise.all([
    getRegionByIdForEdit(regionId),
    getAllLanguages(),
  ]);

  if (!regionRaw) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(regionRaw));

  const tRegion = await getTranslations({ locale, namespace: "region" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={tRegion("form.edit_region")} />
        <RegionForm region={serialized} languages={languages} />
      </ContentWrapper>
    </PageWrapper>
  );
}
