import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";

export default function CurrencyEnergy() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("energy_title")} image={"/images/wiki/energy.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("energy_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
