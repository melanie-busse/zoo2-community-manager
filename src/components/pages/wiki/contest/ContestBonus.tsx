import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";

export default function ContestBonus() {
  const t = useTranslations("wiki_contest");

  return (
    <WikiAccordeon title={t("rank_bonus_title")} image={"/images/wiki/rankbonus.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("rank_bonus_intro")}</WikiIntroText>
        <WikiTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_rank")}</th>
                <th>{t("col_multiplier")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>×4</td>
              </tr>
              <tr>
                <td>2</td>
                <td>×3</td>
              </tr>
              <tr>
                <td>3</td>
                <td>×2</td>
              </tr>
              <tr>
                <td>4+</td>
                <td>×1</td>
              </tr>
            </tbody>
          </WikiTable>
        </WikiTableWrapper>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
