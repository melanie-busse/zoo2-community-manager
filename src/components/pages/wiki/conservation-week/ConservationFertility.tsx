import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";

export default function ConservationFertility() {
  const t = useTranslations("wiki_conservation");

  return (
    <WikiAccordeon
      title={t("fertility_feed_title")}
      image={"/images/wiki/conservation_fertility.png"}
    >
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("fertility_feed_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
