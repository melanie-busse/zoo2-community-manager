import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationTips() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("tips_title")} image={"/images/wiki/tip.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tips_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
