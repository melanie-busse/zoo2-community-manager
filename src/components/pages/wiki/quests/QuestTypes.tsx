import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";

export default function QuestTypes() {
  const t = useTranslations("wiki_quests");

  return (
    <WikiAccordeon title={t("types_title")} image={"/images/wiki/quest.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("types_body")}</WikiIntroText>
        <WikiSubSectionTitleParagraph title={t("tutorial_title")} text={t("tutorial_body")} />
        <WikiSubSectionTitleParagraph title={t("level_title")} text={t("level_body")} />
        <WikiSubSectionTitleParagraph title={t("chain_title")} text={t("chain_body")} />
        <WikiSubSectionTitleParagraph title={t("feature_title")} text={t("feature_body")} />
        <WikiSubSectionTitleParagraph title={t("region_title")} text={t("region_body")} />
        <WikiSubSectionTitleParagraph title={t("misc_title")} text={t("misc_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
