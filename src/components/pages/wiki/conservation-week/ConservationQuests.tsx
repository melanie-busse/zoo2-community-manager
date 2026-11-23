import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationQuests() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("quests_title")} image={"/images/wiki/conservation_quests.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("quests_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
