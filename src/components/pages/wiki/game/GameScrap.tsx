import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";

export default function GameScrap() {
  const t = useTranslations("wiki_game");

  return (
    <WikiAccordeon title={t("scrap_title")} image={"/images/wiki/sell.png"}>
      <WikiAccordionContentWrapper>
        <WikiTitelParagraph title={t("scrap_title2")} paragraph={t("scrap_body")} />
        <WikiTitelParagraph title={t("no_scrap_title")} paragraph={t("no_scrap_intro")} />
        <WikiBulletList>
          {(t.raw("no_scrap_decos") as string[]).map((deco, index) => (
            <li key={`deco-${index}`}>{deco}</li>
          ))}
        </WikiBulletList>

        <p style={{ marginTop: "16px" }}>{t("no_scrap_wheel_intro")}</p>
        <WikiBulletList>
          {(t.raw("no_scrap_wheel") as string[]).map((wheelAnimal, index) => (
            <li key={`wheel-${index}`}>{wheelAnimal}</li>
          ))}
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
