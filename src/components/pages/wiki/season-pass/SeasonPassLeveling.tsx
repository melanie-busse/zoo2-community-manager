import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function SeasonPassLeveling() {
  const t = useTranslations("wiki_seasonpass");

  return (
    <WikiAccordeon title={t("leveling_title")} image={"/images/wiki/seasonpasslevel.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("leveling_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
