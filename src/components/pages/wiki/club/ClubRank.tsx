import React from "react";
import { useTranslations } from "next-intl";

import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";

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

export default function ClubRank() {
  const t = useTranslations("wiki_club");
  const rankTitles = t.raw("rank_titles") as string[];

  return (
    <WikiAccordeon title={t("rank_title")} image={"/images/wiki/memberrank.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("rank_body")}</WikiIntroText>

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
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
