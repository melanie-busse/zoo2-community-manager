import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationGoals() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("community_goal_title")} image={"/images/wiki/conservation_goal.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("community_goal_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
