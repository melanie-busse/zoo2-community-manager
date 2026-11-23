import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationParticipation() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon
      title={t("participation_title")}
      image={"/images/wiki/conservation_participation.png"}
    >
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("participation_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
