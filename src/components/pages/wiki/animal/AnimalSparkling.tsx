import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import { useTranslations } from "next-intl";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

// [streak, odds, chance]
const SPARKLE_CHANCES: [number, string][] = [
  [0, "0.10%"],
  [1, "0.19%"],
  [2, "0.28%"],
  [3, "0.36%"],
  [4, "0.45%"],
  [5, "0.54%"],
  [6, "0.63%"],
  [7, "0.72%"],
  [8, "0.81%"],
  [9, "0.90%"],
  [10, "1.10%"],
];

export default function AnimalSparkling() {
  const t = useTranslations("wiki_animal.animal_sparkling");
  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/animal_sparkling.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("overview_title")} paragraph={t("overview_body")} />
        <WikiTitelParagraph title={t("streak_title")} paragraph={t("streak_body")} />
        <WikiTitelParagraph title={t("chances_title")} paragraph={t("chances_body")} />
        <WikiTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_streak")}</th>
                <th>{t("col_odds")}</th>
                <th>{t("col_chance")}</th>
              </tr>
            </thead>
            <tbody>
              {SPARKLE_CHANCES.map(([streak, chance], i) => (
                <tr key={i}>
                  <td>{streak}</td>
                  <td>{`1 in ${Math.round(100 / parseFloat(chance))}`}</td>
                  <td>{chance}</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTableWrapper>

        <WikiTitelParagraph title={t("breeding_with_title")} paragraph={t("breeding_with_body")} />
        <WikiTitelParagraph title={t("donating_title")} paragraph={t("donating_body")} />
        <WikiTitelParagraph title={t("glow_title")} paragraph={t("glow_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
