"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiFootnote from "@/components/pages/wiki/_elements/WikiFootnote";

// ✓ = has the ability
type RoleAbility = { ability: string; president: boolean; minister: boolean; member: boolean };

const MEMBER_RANKS_DATA: [number, string, string][] = [
  [1, "500", "0"],
  [2, "1,000", "500"],
  [3, "1,500", "1,500"],
  [4, "2,500", "3,000"],
  [5, "3,000", "5,500"],
  [6, "4,000", "8,500"],
  [7, "6,000", "12,500"],
  [8, "8,000", "18,500"],
  [9, "10,000", "26,500"],
  [10, "20,000", "36,500"],
  [11, "40,000", "56,500"],
  [12, "60,000", "96,500"],
  [13, "80,000", "156,500"],
  [14, "100,000", "236,500"],
  [15, "110,000", "336,500"],
  [16, "120,000", "446,500"],
  [17, "130,000", "566,500"],
  [18, "140,000", "696,500"],
  [19, "150,000", "836,500"],
  [20, "MAX", "985,500"],
];

const CLUB_LEVELS: [number, number, string][] = [
  [1, 5, "5,000"],
  [2, 7, "7,500"],
  [3, 8, "10,000"],
  [4, 10, "12,500"],
  [5, 13, "15,000"],
  [6, 15, "17,500"],
  [7, 16, "20,000"],
  [8, 18, "22,500"],
  [9, 18, "25,000"],
  [10, 18, "47,500"],
  [11, 18, "59,500"],
  [12, 18, "72,500"],
  [13, 18, "86,500"],
  [14, 18, "101,500"],
  [15, 18, "117,500"],
  [16, 18, "134,500"],
  [17, 18, "152,500"],
  [18, 18, "171,500"],
  [19, 18, "191,500"],
  [20, 18, "MAX"],
];

export default function WikiClubContent() {
  const t = useTranslations("wiki_club");
  const rankTitles = t.raw("rank_titles") as string[];

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
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <WikiCard title={t("roles_title")}>
        <p>{t("roles_body")}</p>
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
      </WikiCard>

      <WikiCard title={t("assigning_title")}>
        <p>{t("assigning_body")}</p>
      </WikiCard>

      <WikiCard title={t("adding_title")}>
        <p>{t("adding_applicants")}</p>
        <p>{t("adding_invitations")}</p>
      </WikiCard>

      <WikiCard title={t("removing_title")}>
        <p>{t("removing_body")}</p>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>
          {t("turnover_title")}
        </h3>
        <p>{t("turnover_body")}</p>
      </WikiCard>

      <WikiCard title={t("rank_title")}>
        <p>{t("rank_body")}</p>
        <WikiTable>
          <thead>
            <tr>
              <th>{t("rank_col_rank")}</th>
              <th>{t("rank_col_title")}</th>
              <th>{t("rank_col_points")}</th>
              <th>{t("rank_col_cumulative")}</th>
            </tr>
          </thead>
          <tbody>
            {MEMBER_RANKS_DATA.map(([rank, points, cumulative], i) => (
              <tr key={rank}>
                <td>{rank}</td>
                <td>{rankTitles[i] ?? ""}</td>
                <td>{points}</td>
                <td>{cumulative}</td>
              </tr>
            ))}
          </tbody>
        </WikiTable>
      </WikiCard>

      <WikiCard title={t("shop_title")}>
        <p>{t("shop_body")}</p>
      </WikiCard>

      <WikiCard title={t("club_level_title")}>
        <p>{t("club_level_body")}</p>
        <WikiTable>
          <thead>
            <tr>
              <th>{t("club_level_col_level")}</th>
              <th>{t("club_level_col_members")}</th>
              <th>{t("club_level_col_xp")}</th>
            </tr>
          </thead>
          <tbody>
            {CLUB_LEVELS.map(([level, members, xp]) => (
              <tr key={level}>
                <td>{level}</td>
                <td>{members}</td>
                <td>{xp}</td>
              </tr>
            ))}
          </tbody>
        </WikiTable>
      </WikiCard>

      <WikiCard title={t("fundraisers_title")}>
        <p>{t("fundraisers_body")}</p>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>
          {t("fundraiser_types_title")}
        </h3>
        <WikiBulletList>
          <li>{t("fundraiser_type_capacity")}</li>
          <li>{t("fundraiser_type_stickers")}</li>
          <li>{t("fundraiser_type_emblems")}</li>
          <li>{t("fundraiser_type_boosters")}</li>
        </WikiBulletList>
      </WikiCard>

      <WikiCard title={t("contests_title")}>
        <p>{t("contests_body")}</p>
      </WikiCard>

      <WikiCard title={t("leaving_title")}>
        <p>{t("leaving_body")}</p>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>
          {t("leaving_tips_title")}
        </h3>
        <p>{t("leaving_tips_body")}</p>
      </WikiCard>

      <WikiCard title={t("joining_title")}>
        <p>{t("joining_applying")}</p>
        <p>{t("joining_invitation")}</p>
      </WikiCard>

      <WikiCard title={t("finding_title")}>
        <p>{t("finding_body")}</p>
      </WikiCard>
    </WikiContainer>
  );
}
