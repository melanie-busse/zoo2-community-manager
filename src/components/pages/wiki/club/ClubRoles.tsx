import React from "react";
import { useTranslations } from "next-intl";

import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiFootnote from "@/components/pages/wiki/_elements/WikiFootnote";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

type RoleAbility = { ability: string; president: boolean; minister: boolean; member: boolean };

export default function ClubRoles() {
  const t = useTranslations("wiki_club");

  const roleAbilities: RoleAbility[] = [
    { ability: t("roles_ability_description"), president: true, minister: false, member: false },
    { ability: t("roles_ability_manage_members"), president: true, minister: true, member: false },
    {
      ability: t("roles_ability_retract_invitation"),
      president: true,
      minister: false,
      member: false,
    },
    {
      ability: t("roles_ability_assign_president"),
      president: true,
      minister: false,
      member: false,
    },
    { ability: t("roles_ability_assign_role"), president: true, minister: true, member: false },
    { ability: t("roles_ability_fundraiser"), president: true, minister: true, member: false },
    { ability: t("roles_ability_contest"), president: true, minister: true, member: false },
    {
      ability: t("roles_ability_donate_fundraiser"),
      president: true,
      minister: true,
      member: true,
    },
    { ability: t("roles_ability_benefits"), president: true, minister: true, member: true },
    { ability: t("roles_ability_donate_contest"), president: true, minister: true, member: true },
    { ability: t("roles_ability_chat"), president: true, minister: true, member: true },
    { ability: t("roles_ability_emblem"), president: true, minister: true, member: false },
  ];

  return (
    <WikiAccordeon title={t("roles_title")} image={"/images/wiki/membership_role.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("roles_body")}</WikiIntroText>

        <WikiTable>
          <thead>
            <tr>
              <th>{t("roles_table_ability")}</th>
              <th>{t("roles_table_president")}</th>
              <th>{t("roles_table_minister")}</th>
              <th>{t("roles_table_member")}</th>
            </tr>
          </thead>
          <tbody>
            {roleAbilities.map((row, i) => (
              <tr key={i}>
                <td>{row.ability}</td>
                <td style={{ textAlign: "center" }}>{row.president ? "✓" : ""}</td>
                <td style={{ textAlign: "center" }}>{row.minister ? "✓" : ""}</td>
                <td style={{ textAlign: "center" }}>{row.member ? "✓" : ""}</td>
              </tr>
            ))}
          </tbody>
        </WikiTable>
        <WikiFootnote>{t("roles_footnote")}</WikiFootnote>
        <WikiTitelParagraph title={t("assigning_title")} paragraph={t("assigning_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
