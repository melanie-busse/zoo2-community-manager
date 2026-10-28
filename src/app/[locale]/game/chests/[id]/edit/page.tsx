import React from "react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ChestBoostForm from "@/components/pages/chestBoosts/ChestBoostForm";
import { getChestBoostById, getAllAnimalsForChestBoostForm } from "@/service/ChestBoostService";

interface EditChestBoostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditChestBoostPage({ params }: EditChestBoostPageProps) {
  const { locale, id } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") || isMayor(session)) {
    redirect(`/${locale}/game/chests`);
  }

  const boostId = parseInt(id, 10);
  if (isNaN(boostId)) notFound();

  const [boost, animals, t] = await Promise.all([
    getChestBoostById(boostId, locale),
    getAllAnimalsForChestBoostForm(locale),
    getTranslations({ locale, namespace: "chestBoosts" }),
  ]);

  if (!boost) notFound();

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("edit_title")} />
        <ChestBoostForm animals={animals} initialData={boost} mode="edit" />
      </ContentWrapper>
    </PageWrapper>
  );
}
