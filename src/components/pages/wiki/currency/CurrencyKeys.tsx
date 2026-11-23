import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function CurrencyKeys() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("keys_title")} image={"/images/wiki/key.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("keys_body")}</WikiIntroText>
        <WikiTitelParagraph title={t("keys_tip_title")} paragraph={t("keys_tip_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
