import React from "react";
import { useTranslations } from "next-intl";

import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";

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

export default function ClubLevel() {
  const t = useTranslations("wiki_club");

  return (
    <WikiAccordeon title={t("club_level_title")} image={"/images/wiki/clublevel.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("club_level_body")}</WikiIntroText>

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
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
