"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiAccordeon from "../_elements/WikiAccordeon";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";

export default function VideoChest() {
  const t = useTranslations("chestsfaq.video");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/video_chest.jpg"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>

        <WikiTitelParagraph
          title={t("availability_title")}
          paragraph={`🎬 ${t("availability_body")}`}
        />

        <WikiTitelParagraph title={t("content_title")} paragraph={t("content_body")} />
        <WikiTitelParagraph title={t("limit_title")} paragraph={t("limit_body")} />
        <WikiTitelParagraph title={t("platform_title")} paragraph={t("platform_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
