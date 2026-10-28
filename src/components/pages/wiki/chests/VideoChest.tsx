"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import NextImage from "next/image";
import React from "react";

import WikiAccordeon from "../_elements/WikiAccordeon";
import {
  InfoCard,
  InfoGrid,
  InfoLabel,
  InfoValue,
} from "@/components/pages/wiki/chests/FriendshipChest";

export default function VideoChest() {
  const t = useTranslations("chestsfaq.video");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/video_chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("intro")}</IntroText>

        <DetailSection>
          <SubTitle>{t("availability_title")}</SubTitle>
          <p>🎬 {t("availability_body")}</p>
        </DetailSection>

        {/* Sektion: Inhalt */}
        <DetailSection>
          <SubTitle>{t("content_title")}</SubTitle>
          <p>{t("content_body")}</p>
        </DetailSection>

        {/* Sektion: Verfügbarkeit & Bedingungen */}
        <DetailSection>
          <SubTitle>{t("availability_title")}</SubTitle>
          <p>{t("availability_body")}</p>
        </DetailSection>

        {/* Sektion: Limits */}
        <DetailSection>
          <SubTitle>{t("limit_title")}</SubTitle>
          <p>{t("limit_body")}</p>
        </DetailSection>

        {/* Sektion: Plattform-Hinweise */}
        <DetailSection>
          <SubTitle>{t("platform_title")}</SubTitle>
          <p>{t("platform_body")}</p>
        </DetailSection>
      </AccordionContentWrapper>
    </WikiAccordeon>
  );
}

const AccordionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

const IntroText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const SubTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d5a27;
  margin: 12px 0 4px 0;
  padding-bottom: 4px;
  border-bottom: 1.5px solid rgba(45, 90, 39, 0.2);
`;
