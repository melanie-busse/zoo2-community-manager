import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function GameTerrainEditor() {
  const t = useTranslations("wiki_game.terraineditor");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/terrain_editor.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("overview_title")} paragraph={t("overview_body")} />
        <WikiTitelParagraph title={t("access_title")} paragraph={t("access_body")} />
        <WikiTitelParagraph title={t("visuals_title")} paragraph={t("visuals_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
