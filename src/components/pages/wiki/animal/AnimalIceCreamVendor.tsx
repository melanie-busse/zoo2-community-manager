import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";

export default function AnimalIceCreamVendor() {
  const t = useTranslations("wiki_animal.ice_cream_vendor");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/ice_cream_vendor.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiSubSectionTitleParagraph
          title={t("how_it_works_title")}
          text={t("how_it_works_body")}
        />
        <WikiSubSectionTitleParagraph title={t("deals_title")} text={t("deals_body")} />
        <WikiSubSectionTitleParagraph title={t("obtaining_title")} text={t("obtaining_body")} />
        <WikiSubSectionTitleParagraph title={t("npc_title")} text={t("npc_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
