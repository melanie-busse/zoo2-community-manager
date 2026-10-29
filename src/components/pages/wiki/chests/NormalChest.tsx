import { useTranslations } from "next-intl";
import React from "react";

import WikiAccordeon from "../_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiInfoGrid from "@/components/pages/wiki/_elements/WikiInfoGrid";
import WikiInfoCard from "@/components/pages/wiki/_elements/WikiInfoCard";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

const COST_LEVELS: [number, string][] = [
  [1, "250"],
  [5, "1.250"],
  [10, "2.500"],
  [15, "3.750"],
  [20, "5.000"],
  [25, "6.250"],
  [30, "7.500"],
  [35, "8.750"],
  [40, "10.000"],
  [45, "11.250"],
  [50, "12.500"],
  [55, "13.750"],
  [60, "15.000"],
  [65, "16.250"],
  [70, "17.500"],
];

export default function NormalChest() {
  const t = useTranslations("chestsfaq.normal");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/normal_chest.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiInfoGrid>
          <WikiInfoCard label={tChest("limit")} value={`📦 Max. 100 ${tChest("chests")}`} />
        </WikiInfoGrid>

        <WikiTitelParagraph title={t("cost_title")} paragraph={t("cost_body")}>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("cost_col_level")}</th>
                <th>{t("cost_col_cost")}</th>
              </tr>
            </thead>
            <tbody>
              {COST_LEVELS.map(([level, cost]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{cost} Coins</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTitelParagraph>

        <WikiTitelParagraph title={t("contents_title")} paragraph={t("contents_body")} />
        <WikiTitelParagraph title={t("tips_title")} paragraph={t("tips_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
