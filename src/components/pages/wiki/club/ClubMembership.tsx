import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";

export default function ClubMembership() {
  const t = useTranslations("wiki_club");

  return (
    <WikiAccordeon title={t("club_membership_title")} image={"/images/wiki/member.png"}>
      <WikiAccordionContentWrapper>
        <WikiTitelParagraph title={t("joining_title")} paragraph={t("joining_applying")} />
        <WikiIntroText>{t("joining_invitation")}</WikiIntroText>
        <WikiTitelParagraph title={t("finding_title")} paragraph={t("finding_body")} />
        <WikiTitelParagraph title={t("leaving_title")} paragraph={t("leaving_body")} />
        <WikiSubSectionTitleParagraph
          title={t("leaving_tips_title")}
          text={t("leaving_tips_body")}
        />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
