import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";

export default function QuestHide() {
  const t = useTranslations("wiki_quests");

  return (
    <WikiAccordeon title={t("hide_quests_title")} image={"/images/wiki/check.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("hide_quests_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
