import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationAnimals() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon title={t("animal_list_title")} image={"/images/wiki/conservation_animals.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("animal_list_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
