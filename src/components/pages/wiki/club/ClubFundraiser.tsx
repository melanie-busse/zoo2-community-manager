import React from "react";
import { useTranslations } from "next-intl";

import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function ClubFundraiser() {
  const t = useTranslations("wiki_club");

  return (
    <WikiAccordeon title={t("fundraisers_title")} image={"/images/wiki/fundraisers.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("fundraisers_body")}</WikiIntroText>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>
          {t("fundraiser_types_title")}
        </h3>
        <WikiBulletList>
          <li>{t("fundraiser_type_capacity")}</li>
          <li>{t("fundraiser_type_stickers")}</li>
          <li>{t("fundraiser_type_emblems")}</li>
          <li>{t("fundraiser_type_boosters")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
