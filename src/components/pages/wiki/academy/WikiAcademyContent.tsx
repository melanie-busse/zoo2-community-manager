"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import AcademyMembership from "@/components/pages/wiki/academy/AcademyMembership";
import AcademyStamps from "@/components/pages/wiki/academy/AcademyStamps";
import AcademyMastery from "@/components/pages/wiki/academy/AcademyMastery";
import AcademyTasks from "@/components/pages/wiki/academy/AcademyTasks";
import AcademyTips from "@/components/pages/wiki/academy/AcademyTips";

export default function WikiAcademyContent() {
  const t = useTranslations("wiki_academy");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <AcademyMembership />
      <AcademyStamps />
      <AcademyMastery />
      <AcademyTasks />
      <AcademyTips />
    </>
  );
}
