"use client";

import React from "react";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/EmptyState/EmptyState.styles";

interface EmptyStateProps {
  object: string;
  title?: string;
  message?: string;
  buttonText?: string;
  onResetAction?: () => void;
}

export default function EmptyState({ title = "", message = "" }: EmptyStateProps) {
  const t = useTranslations("common");

  return (
    <Styles.OuterContainer>
      <Styles.Container>
        <Styles.SpeechBubble>
          <h3>{title || t("emptyState.title")}</h3>
          <p>{message || t("emptyState.message")}</p>
        </Styles.SpeechBubble>

        <Styles.UppyPortraitFrame>
          <NextImage
            src="/images/uppy-traurig.png"
            alt={t("emptyState.uppySad")}
            width={240}
            height={320}
            style={{
              objectFit: "contain",
            }}
          />
        </Styles.UppyPortraitFrame>
      </Styles.Container>
    </Styles.OuterContainer>
  );
}
