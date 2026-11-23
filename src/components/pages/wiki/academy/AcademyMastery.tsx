import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function AcademyMastery() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiAccordeon title={t("mastery_title")} image={"/images/wiki/academy_mastery.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("mastery_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
