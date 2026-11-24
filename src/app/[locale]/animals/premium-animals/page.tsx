import React from "react";
import { getTranslations } from "next-intl/server";
import { PremiumVipType } from "@prisma/client";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getPremiumVipAnimals, getAvailableYears } from "@/service/PremiumVipAnimalService";
import BonusAnimalsContent from "@/components/pages/animals/bonus-animals/BonusAnimalsContent";

export default async function PremiumAnimalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [t, { entries, total }, availableYears] = await Promise.all([
    getTranslations({ locale, namespace: "animals_bonus" }),
    getPremiumVipAnimals(PremiumVipType.PREMIUM, { page: 1, pageSize: 25 }, locale),
    getAvailableYears(PremiumVipType.PREMIUM),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("premium_title")} />
        <BonusAnimalsContent
          type="PREMIUM"
          initialData={{ entries, total, availableYears }}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
