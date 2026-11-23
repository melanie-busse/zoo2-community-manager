"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import ConservationParticipation from "@/components/pages/wiki/conservation-week/ConservationParticipation";
import ConservationTiers from "@/components/pages/wiki/conservation-week/ConservationTiers";
import ConservationPoints from "@/components/pages/wiki/conservation-week/ConservationPoints";
import ConservationTasks from "@/components/pages/wiki/conservation-week/ConservationTasks";
import ConservationAnimals from "@/components/pages/wiki/conservation-week/ConservationAnimals";
import ConservationQuests from "@/components/pages/wiki/conservation-week/ConservationQuests";
import ConservationGoals from "@/components/pages/wiki/conservation-week/ConservationGoals";
import ConservationRanking from "@/components/pages/wiki/conservation-week/ConservationRanking";
import ConservationTitles from "@/components/pages/wiki/conservation-week/ConservationTitles";
import ConservationFertility from "@/components/pages/wiki/conservation-week/ConservationFertility";
import ConservationTips from "@/components/pages/wiki/conservation-week/ConservationTips";

export default function WikiConservationContent() {
  const t = useTranslations("wiki_conservation");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <ConservationParticipation />
      <ConservationTiers />
      <ConservationPoints />
      <ConservationTasks />
      <ConservationAnimals />
      <ConservationQuests />
      <ConservationGoals />
      <ConservationRanking />
      <ConservationTitles />
      <ConservationFertility />
      <ConservationTips />
    </>
  );
}
