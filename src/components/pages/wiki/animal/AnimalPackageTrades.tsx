import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiNumberList } from "@/components/pages/wiki/_elements/WikiNumberList";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function AnimalPackageTrades() {
  const t = useTranslations("wiki_animal.animal_package");

  return (
    <WikiAccordeon title={t("title_package")} image={"/images/wiki/animal_bonus.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro_package")}</WikiIntroText>

        <WikiTitelParagraph title={t("how_title")} paragraph="" />
        <WikiNumberList>
          <li>{t("how_step1")}</li>
          <li>{t("how_step2")}</li>
          <li>{t("how_step3")}</li>
          <li>{t("how_step4")}</li>
        </WikiNumberList>

        <WikiTitelParagraph title={t("exclusions_title")} paragraph={t("exclusions_body")} />

        <WikiTitelParagraph title={t("exclusions_rules_title")} paragraph="" />
        <WikiBulletList>
          <li>{t("exclusion_premium")}</li>
          <li>{t("exclusion_pairs")}</li>
          <li>{t("exclusion_list")}</li>
          <li>{t("exclusion_enclosure")}</li>
        </WikiBulletList>

        <WikiTitelParagraph title={t("tradelist_title")} paragraph={t("tradelist_body")} />
        <WikiTitelParagraph title={t("tradelist_tip")} paragraph={t("tradelist_tip_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
