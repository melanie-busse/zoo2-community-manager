import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";

export default function CurrencyFeathers() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiAccordeon title={t("feathers_title")} image={"/images/wiki/feather.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("feathers_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
