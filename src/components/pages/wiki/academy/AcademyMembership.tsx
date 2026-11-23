import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function AcademyMembership() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiAccordeon title={t("membership_title")} image={"/images/wiki/academyrank.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("membership_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
