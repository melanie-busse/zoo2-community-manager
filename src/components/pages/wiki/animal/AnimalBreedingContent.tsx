import { useTranslations } from "next-intl";
import React from "react";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

const REGION_BIOMES: string[][] = [
  ["Main Zoo", "All biomes"],
  ["Fir Grove", "Forest"],
  ["Kujali Park", "Plains & Savanna"],
  ["Oceanside Zoo", "Water"],
  ["Polar Park", "Ice"],
  ["Rainforest Park", "Jungle"],
];
export default function AnimalBreedingContent() {
  const t = useTranslations("wiki_animal.animal_breeding");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/breeding.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiTitelParagraph title={t("requirements_title")} paragraph={t("requirements_body")} />
        <WikiTitelParagraph title={t("how_to_breed_title")} paragraph={t("how_to_breed_body")} />
        <WikiTitelParagraph title={t("simultaneous_title")} paragraph={t("simultaneous_body")} />
        <WikiTitelParagraph title={t("twins_title")} paragraph={t("twins_body")} />
        <WikiTitelParagraph title={t("growing_up_title")} paragraph={t("growing_up_body")} />
        <WikiTitelParagraph title={t("power_growth_title")} paragraph={t("power_growth_body")} />
        <WikiTitelParagraph title={t("reducing_time_title")} paragraph={t("reducing_time_body")} />
        <WikiTitelParagraph title={t("reducing_rest_title")} paragraph={t("reducing_rest_body")} />

        <WikiTitelParagraph title={t("bonuses_title")} paragraph={t("bonuses_body")} />
        {t("bonus_types_title")}
        <WikiBulletList>
          <li>{t("bonus_club")}</li>
          <li>{t("bonus_academy")}</li>
          <li>{t("bonus_fertility")}</li>
          <li>{t("bonus_failed")}</li>
          <li>{t("bonus_region")}</li>
        </WikiBulletList>

        {t("region_bonus_title")}
        <p>{t("region_bonus_body")}</p>
        <WikiTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_region")}</th>
                <th>{t("col_biome")}</th>
              </tr>
            </thead>
            <tbody>
              {REGION_BIOMES.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </WikiTableWrapper>

        <WikiTitelParagraph title={t("special_coats_title")} paragraph={t("special_coats_body")} />
        <WikiTitelParagraph title={t("animal_levels_title")} paragraph={t("animal_levels_body")} />
        <WikiTitelParagraph title={t("animal_xp_title")} paragraph={t("animal_xp_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
