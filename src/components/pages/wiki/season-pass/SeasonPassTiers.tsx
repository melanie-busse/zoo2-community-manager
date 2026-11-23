import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function SeasonPassTiers() {
  const t = useTranslations("wiki_seasonpass");

  return (
    <WikiAccordeon title={t("tiers_title")} image={"/images/wiki/seasonpassrank.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tiers_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
