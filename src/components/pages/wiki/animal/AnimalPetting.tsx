import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function AnimalPetting() {
  const t = useTranslations("wiki_animal.animal_petting");

  return (
    <WikiAccordeon title={t("petting_title")} image={"/images/wiki/animal_petting.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("petting_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
