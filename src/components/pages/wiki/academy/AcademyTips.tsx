import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function AcademyTips() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiAccordeon title={t("tips_title")} image={"/images/wiki/tip.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("tips_intro")}</WikiIntroText>
        <WikiBulletList>
          <li>{t("tip_1")}</li>
          <li>{t("tip_2")}</li>
          <li>{t("tip_3")}</li>
          <li>{t("tip_4")}</li>
          <li>{t("tip_5")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
