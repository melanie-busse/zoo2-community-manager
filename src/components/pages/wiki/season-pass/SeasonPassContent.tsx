"use client";

import React from "react";
import { useTranslations } from "next-intl";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import SeasonPassTiers from "@/components/pages/wiki/season-pass/SeasonPassTiers";
import SeasonPassLeveling from "@/components/pages/wiki/season-pass/SeasonPassLeveling";
import SeasonPassXp from "@/components/pages/wiki/season-pass/SeasonPassXp";
import SeasonPassFeathers from "@/components/pages/wiki/season-pass/SeasonPassFeathers";
import SeasonPassTip from "@/components/pages/wiki/season-pass/SeasonPassTip";

export default function SeasonPassContent() {
  const t = useTranslations("wiki_seasonpass");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <SeasonPassTiers />
      <SeasonPassLeveling />
      <SeasonPassXp />
      <SeasonPassFeathers />
      <SeasonPassTip />
    </>
  );
}
