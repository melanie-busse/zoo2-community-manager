import React from "react";
import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllMayorQuests } from "@/service/MayorQuestService";
import MayorQuestCard from "@/components/pages/game/mayorquests/MayorQuestCard";

export default async function MayorQuestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [quests, t] = await Promise.all([
    getAllMayorQuests(),
    getTranslations({ locale, namespace: "mayorquest" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        {quests.map((quest) => (
          <MayorQuestCard key={quest.id} quest={quest} />
        ))}
      </ContentWrapper>
    </PageWrapper>
  );
}
