"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";
import QuestTypes from "@/components/pages/wiki/quests/QuestTypes";
import QuestTips from "@/components/pages/wiki/quests/QuestTips";
import QuestHide from "@/components/pages/wiki/quests/QuestHide";
import QuestRewards from "@/components/pages/wiki/quests/QuestRewards";

export default function WikiQuestsContent() {
  const t = useTranslations("wiki_quests");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <QuestTypes />
      <QuestRewards />
      <QuestTips />
      <QuestHide />
    </>
  );
}
