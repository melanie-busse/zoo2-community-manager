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

export default function TerraquaChest() {
  const t = useTranslations("chestsfaq.terraqua");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/terraqua_chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("intro")}</IntroText>

        <InfoGrid>
          <InfoCard>
            <InfoLabel>{tChest("cost")}</InfoLabel>
            <InfoValue>
              29{" "}
              <NextImage
                src={"/images/currency/diamant.webp"}
                alt={"Diamant"}
                width={20}
                height={20}
              />
            </InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>{t("release_label")}</InfoLabel>
            <InfoValue>📅 13.03.2023</InfoValue>
          </InfoCard>
        </InfoGrid>

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
