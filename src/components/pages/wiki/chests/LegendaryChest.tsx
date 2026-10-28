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

const SHOP_CARTS: string[] = ["Ice Cream Cart", "Drink Cart", "Snack Cart", "Souvenir Cart"];

export default function LegendaryChest() {
  const t = useTranslations("chestsfaq.legendary");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/legendary_chest.jpg"}>
      <AccordionContentWrapper>
        <IntroText>{t("intro")}</IntroText>

        <InfoGrid>
          <InfoCard>
            <InfoLabel>{tChest("cost")}</InfoLabel>
            <InfoValue>
              49{" "}
              <NextImage
                src={"/images/currency/diamant.webp"}
                alt={"Diamant"}
                width={20}
                height={20}
              />
            </InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>{tChest("limit")}</InfoLabel>
            <InfoValue>📦 Max. 100 {tChest("chests")}</InfoValue>
          </InfoCard>
        </InfoGrid>

        {/* Sektion: Inhalt */}
        <DetailSection>
          <SubTitle>{t("contents_title")}</SubTitle>
          <p>{t("contents_body")}</p>
          <p>{t("shop_carts_body")}</p>
          <BulletList>
            {SHOP_CARTS.map((cart) => (
              <li key={cart}>{cart} (Legendary)</li>
            ))}
          </BulletList>
        </DetailSection>

        {/* Sektion: Drop-Bonus */}
        <DetailSection>
          <SubTitle>{t("drop_bonus_title")}</SubTitle>
          <p>{t("drop_bonus_body")}</p>
        </DetailSection>

        {/* Sektion: Tipps */}
        <DetailSection>
          <SubTitle>{t("tips_title")}</SubTitle>
          <p>{t("tips_body")}</p>
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

const SubSectionTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
