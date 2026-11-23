import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";

export default function QuestTips() {
  const t = useTranslations("wiki_quests");

  return (
    <WikiAccordeon title={t("tips_title")} image={"/images/wiki/tip.png"}>
      <WikiAccordionContentWrapper>
        <WikiSubSectionTitleParagraph
          title={t("tips_title_retroactive")}
          text={t("tips_body_retroactive")}
        />
        <WikiSubSectionTitleParagraph
          title={t("tips_title_timelimited")}
          text={t("tips_body_timelimited")}
        />
        <WikiSubSectionTitleParagraph
          title={t("tips_title_diamonds")}
          text={t("tips_body_diamonds")}
        />
        <WikiSubSectionTitleParagraph
          title={t("tips_title_puzzles")}
          text={t("tips_body_puzzles")}
        />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
