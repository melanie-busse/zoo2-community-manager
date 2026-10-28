import React from "react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ChestBoostForm from "@/components/pages/chestBoosts/ChestBoostForm";
import { getAllAnimalsForChestBoostForm } from "@/service/ChestBoostService";

interface CreateChestBoostPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateChestBoostPage({ params }: CreateChestBoostPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") || isMayor(session)) {
    redirect(`/${locale}/game/chests`);
  }

  const [animals, t] = await Promise.all([
    getAllAnimalsForChestBoostForm(locale),
    getTranslations({ locale, namespace: "chestBoosts" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("create_title")} />
        <ChestBoostForm animals={animals} mode="create" />
      </ContentWrapper>
    </PageWrapper>
  );
}
