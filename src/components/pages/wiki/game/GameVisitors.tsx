import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function GameVisitors() {
  const t = useTranslations("wiki_game.visitors");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/visitors.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("modifiers_title")} paragraph={t("modifiers_intro")} />
        <WikiTitelParagraph title={t("animals_title")} paragraph={t("animals_body")} />
        <WikiTitelParagraph title={t("decorations_title")} paragraph={t("decorations_intro")} />
        <WikiTitelParagraph title={t("plants_title")} paragraph={t("plants_body")} />
        <WikiTitelParagraph
          title={t("enclosure_deco_title")}
          paragraph={t("enclosure_deco_body")}
        />
        <WikiTitelParagraph title={t("object_deco_title")} paragraph={t("object_deco_body")} />
        <WikiTitelParagraph title={t("bathrooms_title")} paragraph={t("bathrooms_body")} />
        <WikiTitelParagraph title={t("trash_title")} paragraph={t("trash_body")} />
        <WikiTitelParagraph title={t("npcs_title")} paragraph={t("npcs_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
