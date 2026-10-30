import { useTranslations } from "next-intl";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";
import React from "react";

export default function Coins() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("coins_title")} image={"/images/wiki/dollar.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("coins_body")}</WikiIntroText>
        <WikiSubSectionTitle>{t("generating_coins_title")}</WikiSubSectionTitle>
        <p>{t("generating_coins_body")}</p>
        <WikiSubSectionTitle>{t("spending_coins_title")}</WikiSubSectionTitle>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}