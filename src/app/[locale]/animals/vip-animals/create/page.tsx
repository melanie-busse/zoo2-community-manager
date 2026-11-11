import React from "react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import BonusAnimalForm from "@/components/pages/animals/bonus-animals/BonusAnimalForm";
import { getAllAnimalsForBonusForm } from "@/service/PremiumVipAnimalService";

export default async function CreateVipAnimalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") || isMayor(session)) {
    redirect(`/${locale}/animals/vip-animals`);
  }

  const [animals, t] = await Promise.all([
    getAllAnimalsForBonusForm(locale),
    getTranslations({ locale, namespace: "animals_bonus" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("create_title")} />
        <BonusAnimalForm animals={animals} defaultType="VIP" mode="create" />
      </ContentWrapper>
    </PageWrapper>
  );
}
