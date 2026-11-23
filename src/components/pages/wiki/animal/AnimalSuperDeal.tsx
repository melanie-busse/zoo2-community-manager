import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function AnimalSuperDeal() {
  const t = useTranslations("wiki_animal.super_deals");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/super_offer.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("how_it_works_body")}</WikiIntroText>
        <WikiTitelParagraph title={t("types_title")} paragraph={t("types_body")} />
        <WikiTitelParagraph title={t("discontinued_title")} paragraph={t("discontinued_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
