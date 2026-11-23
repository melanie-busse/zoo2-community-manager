"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";
import ContestFundraiser from "@/components/pages/wiki/contest/ContestFundraisers";
import ContestBonus from "@/components/pages/wiki/contest/ContestBonus";
import ContestPrice from "@/components/pages/wiki/contest/ContestPrice";

export default function WikiContestContent() {
  const t = useTranslations("wiki_contest");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <WikiCard title={t("new_members_title")}>
        <p>{t("new_members_body")}</p>
      </WikiCard>

      <ContestFundraiser />
      <ContestBonus />
      <ContestPrice />
    </>
  );
}
