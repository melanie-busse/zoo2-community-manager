import React from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllLanguages } from "@/service/LanguageService";
import { getOriginById } from "@/service/OriginService";
import OriginForm from "@/components/pages/zoo/origins/OriginForm";

export default async function EditOriginPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const originId = parseInt(id, 10);
  if (isNaN(originId)) notFound();

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    redirect(`/${locale}/zoo/origins`);
  }

  const [origin, languages, t] = await Promise.all([
    getOriginById(originId),
    getAllLanguages(),
    getTranslations({ locale, namespace: "origin" }),
  ]);

  if (!origin) notFound();

  const serialized = JSON.parse(JSON.stringify(origin));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("form.edit_origin")} />
        <OriginForm origin={serialized} languages={languages} />
      </ContentWrapper>
    </PageWrapper>
  );
}
