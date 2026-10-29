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

export default function NoctaviaChest() {
  const t = useTranslations("chestsfaq.noctavia");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/noctavia_chest.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiInfoGrid>
          <WikiInfoCard
            label={tChest("cost")}
            value={
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                29
                <NextImage
                  src={"/images/currency/diamant.webp"}
                  alt={"Diamant"}
                  width={20}
                  height={20}
                />
              </span>
            }
          />
          <WikiInfoCard label={t("release_label")} value={`📅 07.04.2026`} />
        </WikiInfoGrid>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
