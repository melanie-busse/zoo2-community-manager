import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function GameCalendar() {
  const t = useTranslations("wiki_game.calendar");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/bulldozer.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("how_it_works_title")} paragraph={t("how_it_works_body")} />
        <WikiTitelParagraph title={t("advent_title")} paragraph={t("advent_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
