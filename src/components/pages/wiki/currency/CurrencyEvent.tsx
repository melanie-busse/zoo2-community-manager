import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function CurrencyEvent() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("event_currency_title")} image={"/images/wiki/event.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("event_currency_body")}</WikiIntroText>
        <WikiTitelParagraph title={t("event_tip_title")} paragraph={t("event_tip_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
