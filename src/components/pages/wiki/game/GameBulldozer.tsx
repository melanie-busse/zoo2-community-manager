import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function GameBulldozer() {
  const t = useTranslations("wiki_game.bulldozer");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/bulldozer.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("overview_title")} paragraph={t("overview_body")} />
        <WikiTitelParagraph title={t("event_title")} paragraph={t("event_body")} />
        <WikiTitelParagraph title={t("energy_title")} paragraph={t("energy_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
