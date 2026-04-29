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

export default function EmptyState({
  object,
  title = "",
  message = "",
  buttonText = "",
  onResetAction = () => {},
}: EmptyStateProps) {
  const t = useTranslations();

  return (
    <Styles.OuterContainer>
      <Styles.Container>
        <Styles.SpeechBubble>
          <h3>{title || t(`EmptyState.${object}.title`)}</h3>
          <p>{message || t("EmptyState.message")}</p>
        </Styles.SpeechBubble>

        <Styles.UppyPortraitFrame>
          <NextImage
            src="/images/uppy-traurig.png"
            alt={t("EmptyState.uppySad")}
            width={240}
            height={320}
            style={{
              objectFit: "contain",
            }}
          />
        </Styles.UppyPortraitFrame>

        {onResetAction && (
          <Styles.ResetButton onClick={onResetAction}>
            🐾 {buttonText || t("EmptyState.button")}
          </Styles.ResetButton>
        )}
      </Styles.Container>
    </Styles.OuterContainer>
  );
}
