import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function CurrencyTickets() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("tickets_title")} image={"/images/wiki/ticket.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tickets_body")}</WikiIntroText>
        <WikiTitelParagraph title={t("tickets_sale_title")} paragraph={t("tickets_sale_body")} />
        <WikiTitelParagraph title={t("tickets_tips_title")} paragraph={t("tickets_tips_body")} />
        <p>{t("puzzles_body")}</p>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
