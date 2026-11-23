import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";

export default function QuestRewards() {
  const t = useTranslations("wiki_quests");

  return (
    <WikiAccordeon title={t("rewards_title")} image={"/images/wiki/dollar.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("rewards_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
