import React from "react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import BonusAnimalForm from "@/components/pages/animals/bonus-animals/BonusAnimalForm";
import { getEntryById, getAllAnimalsForBonusForm } from "@/service/PremiumVipAnimalService";

export default async function EditPremiumAnimalPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") || isMayor(session)) {
    redirect(`/${locale}/animals/premium-animals`);
  }

  const entryId = parseInt(id, 10);
  if (isNaN(entryId)) notFound();

  const [entry, animals, t] = await Promise.all([
    getEntryById(entryId),
    getAllAnimalsForBonusForm(locale),
    getTranslations({ locale, namespace: "animals_bonus" }),
  ]);

  if (!entry || entry.type !== "PREMIUM") notFound();

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("edit_title")} />
        <BonusAnimalForm animals={animals} initialData={entry} defaultType="PREMIUM" mode="edit" />
      </ContentWrapper>
    </PageWrapper>
  );
}
