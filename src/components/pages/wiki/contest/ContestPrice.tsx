import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import ContestFundraiser from "@/components/pages/wiki/contest/ContestFundraisers";
import ContestBonus from "@/components/pages/wiki/contest/ContestBonus";

const STATUE_REWARDS: [string, number, number][] = [
  ["1", 10000, 100],
  ["2", 9000, 99],
  ["3", 8000, 98],
  ["4", 5500, 97],
  ["5", 5000, 96],
  ["6", 4500, 95],
  ["7", 4000, 94],
  ["8", 3500, 93],
  ["9", 3000, 92],
  ["10", 2500, 91],
  ["11–25", 1500, 80],
  ["26–50", 1500, 65],
  ["51–75", 1500, 50],
  ["76–100", 1500, 20],
  ["101–500", 1250, 1],
  ["501–1000", 1000, 1],
  ["1001–1500", 750, 1],
  ["1501+", 500, 1],
];

const SPECIAL_COAT_REWARDS: [string, number, number][] = [
  ["1", 10000, 200],
  ["2", 9000, 190],
  ["3", 8000, 180],
  ["4", 5500, 170],
  ["5", 5000, 160],
  ["6", 4500, 150],
  ["7", 4000, 140],
  ["8", 3500, 130],
  ["9", 3000, 120],
  ["10", 2500, 110],
  ["11–25", 1500, 100],
  ["26–50", 1500, 90],
  ["51–75", 1500, 80],
  ["76–100", 1500, 70],
  ["101–200", 1250, 60],
  ["201–300", 1200, 50],
  ["301–400", 1150, 40],
  ["401–500", 1100, 30],
  ["501–600", 1050, 20],
  ["601–700", 1000, 10],
  ["701–800", 950, 9],
  ["801–900", 900, 8],
  ["901–1000", 850, 7],
  ["1001–1100", 800, 6],
  ["1101–1200", 750, 5],
  ["1201–1300", 700, 4],
  ["1301–1400", 650, 3],
  ["1401–1500", 600, 2],
  ["1501+", 550, 1],
];
export default function ContestPrice() {
  const t = useTranslations("wiki_contest");

  return (
    <WikiAccordeon title={t("rewards_title")} image={"/images/wiki/clubbonus.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("rewards_body")}</WikiIntroText>
        <WikiSubSectionTitle>{t("statue_rewards_title")}</WikiSubSectionTitle>

        <WikiTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_rank")}</th>
                <th>{t("col_guild_exp")}</th>
                <th>{t("col_puzzle_pct")}</th>
              </tr>
            </thead>
            <tbody>
              {STATUE_REWARDS.map(([rank, exp, puzzle]) => (
                <tr key={rank}>
                  <td>{rank}</td>
                  <td>{exp.toLocaleString()}</td>
                  <td>{puzzle}%</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTableWrapper>

        <WikiSubSectionTitle>{t("special_coat_rewards_title")}</WikiSubSectionTitle>

        <WikiTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_rank")}</th>
                <th>{t("col_guild_exp")}</th>
                <th>{t("col_animal_purchases")}</th>
              </tr>
            </thead>
            <tbody>
              {SPECIAL_COAT_REWARDS.map(([rank, exp, purchases]) => (
                <tr key={rank}>
                  <td>{rank}</td>
                  <td>{exp.toLocaleString()}</td>
                  <td>{purchases}</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTableWrapper>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
