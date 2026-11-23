import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function ConservationTiers() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("tiers_title")} image={"/images/wiki/expert_icon.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tiers_body")}</WikiIntroText>
        <WikiBulletList>
          <li>{t("tiers_helper")}</li>
          <li>{t("tiers_expert")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
