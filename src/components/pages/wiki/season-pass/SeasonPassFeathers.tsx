import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

const FEATHER_BUNDLES: [string, string, string][] = [
  ["Small", "200", "19 ◆"],
  ["Medium", "2,000", "99 ◆"],
  ["Large", "5,000", "199 ◆"],
];
export default function SeasonPassFeathers() {
  const t = useTranslations("wiki_seasonpass");

  return (
    <WikiAccordeon title={t("feathers_title")} image={"/images/wiki/feather.webp"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("feathers_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>

      <WikiTableWrapper>
        <WikiTable>
          <thead>
            <tr>
              <th>{t("feathers_col_bundle")}</th>
              <th>{t("feathers_col_feathers")}</th>
              <th>{t("feathers_col_cost")}</th>
            </tr>
          </thead>
          <tbody>
            {FEATHER_BUNDLES.map(([bundle, feathers, cost]) => (
              <tr key={bundle}>
                <td>{bundle}</td>
                <td>{feathers}</td>
                <td>{cost}</td>
              </tr>
            ))}
          </tbody>
        </WikiTable>
      </WikiTableWrapper>
    </WikiAccordeon>
  );
}
