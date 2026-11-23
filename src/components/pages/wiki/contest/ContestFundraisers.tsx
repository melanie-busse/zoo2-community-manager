import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";

export default function ContestFundraiser() {
  const t = useTranslations("wiki_contest");

  return (
    <WikiAccordeon title={t("donation_title")} image={"/images/wiki/fundraisers.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("donation_intro")}</WikiIntroText>
        <WikiSubSectionTitleParagraph
          title={t("contest_points_title")}
          text={t("contest_points_body")}
        />
        <WikiSubSectionTitleParagraph
          title={t("member_points_title")}
          text={t("member_points_body")}
        />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
