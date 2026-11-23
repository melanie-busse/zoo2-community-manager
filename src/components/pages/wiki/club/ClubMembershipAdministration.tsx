import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import { useTranslations } from "next-intl";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";

export default function ClubMembershipAdministration() {
  const t = useTranslations("wiki_club");

  return (
    <WikiAccordeon title={t("admin_title")} image={"/images/wiki/member.png"}>
      <WikiAccordionContentWrapper>
        <WikiTitelParagraph title={t("adding_title")} paragraph={t("adding_applicants")} />
        <WikiIntroText>{t("adding_invitations")}</WikiIntroText>
        <WikiTitelParagraph title={t("removing_title")} paragraph={t("removing_body")} />
        <WikiSubSectionTitleParagraph title={t("turnover_title")} text={t("turnover_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
