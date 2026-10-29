"use client";

import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React from "react";

import WikiAccordeon from "../_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiInfoGrid from "@/components/pages/wiki/_elements/WikiInfoGrid";
import WikiInfoCard from "@/components/pages/wiki/_elements/WikiInfoCard";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function RetroChest() {
  const t = useTranslations("chestsfaq.retro");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/retro_chest.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiInfoGrid>
          <WikiInfoCard
            label={tChest("cost")}
            value={
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                39
                <NextImage
                  src={"/images/currency/diamant.webp"}
                  alt={"Diamant"}
                  width={20}
                  height={20}
                />
              </span>
            }
          />
          <WikiInfoCard label={tChest("limit")} value={`📦 Max. 100 ${tChest("chests")}`} />
        </WikiInfoGrid>

        <WikiTitelParagraph title={t("contents_title")} paragraph={t("contents_body")} />
        <WikiTitelParagraph title={t("drop_bonus_title")} paragraph={t("drop_bonus_body")} />
        <WikiTitelParagraph title={t("tips_title")} paragraph={t("tips_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
