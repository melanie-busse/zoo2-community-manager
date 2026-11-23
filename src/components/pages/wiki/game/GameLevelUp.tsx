import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import React from "react";
import { useTranslations } from "next-intl";

export default function GameLevelUp() {
  const t = useTranslations("wiki_game");

  return (
    <WikiAccordeon title={t("levelup_title")} image={"/images/wiki/star.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("levelup_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
