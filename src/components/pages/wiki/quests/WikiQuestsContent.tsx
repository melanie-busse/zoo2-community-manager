"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";

export default function WikiQuestsContent() {
  const t = useTranslations("wiki_quests");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <WikiCard title={t("types_title")}>
        <p>{t("types_body")}</p>

        <WikiSubSectionTitle>{t("tutorial_title")}</WikiSubSectionTitle>
        <p>{t("tutorial_body")}</p>

        <WikiSubSectionTitle>{t("level_title")}</WikiSubSectionTitle>
        <p>{t("level_body")}</p>

        <WikiSubSectionTitle>{t("chain_title")}</WikiSubSectionTitle>
        <p>{t("chain_body")}</p>

        <WikiSubSectionTitle>{t("feature_title")}</WikiSubSectionTitle>
        <p>{t("feature_body")}</p>

        <WikiSubSectionTitle>{t("region_title")}</WikiSubSectionTitle>
        <p>{t("region_body")}</p>

        <WikiSubSectionTitle>{t("misc_title")}</WikiSubSectionTitle>
        <p>{t("misc_body")}</p>
      </WikiCard>

      <WikiCard title={t("rewards_title")}>
        <p>{t("rewards_body")}</p>
      </WikiCard>

      <WikiCard title={t("tips_title")}>
        <WikiSubSectionTitle>{t("tips_title_retroactive")}</WikiSubSectionTitle>
        <p>{t("tips_body_retroactive")}</p>

        <WikiSubSectionTitle>{t("tips_title_timelimited")}</WikiSubSectionTitle>
        <p>{t("tips_body_timelimited")}</p>

        <WikiSubSectionTitle>{t("tips_title_diamonds")}</WikiSubSectionTitle>
        <p>{t("tips_body_diamonds")}</p>

        <WikiSubSectionTitle>{t("tips_title_puzzles")}</WikiSubSectionTitle>
        <p>{t("tips_body_puzzles")}</p>
      </WikiCard>
    </WikiContainer>
  );
}
