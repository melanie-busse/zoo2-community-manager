import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function SeasonPassXp() {
  const t = useTranslations("wiki_seasonpass");

  return (
    <WikiAccordeon title={t("xp_title")} image={"/images/wiki/star.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("xp_body")}</WikiIntroText>
        <WikiTitelParagraph title={t("quiz_title")} paragraph={t("quiz_body")} />
        <WikiTitelParagraph title={t("quests_title")} paragraph={t("quests_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
