import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import React from "react";
import { useTranslations } from "next-intl";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function GameFocusTip() {
  const t = useTranslations("wiki_game");

  return (
    <WikiAccordeon title={t("focus_title")} image={"/images/wiki/tip.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("focus_intro")}</WikiIntroText>

        <WikiBulletList>
          <li>{t("focus_tip_1")}</li>
          <li>{t("focus_tip_2")}</li>
          <li>{t("focus_tip_3")}</li>
          <li>{t("focus_tip_4")}</li>
          <li>{t("focus_tip_5")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
