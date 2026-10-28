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

const EPIC_ANIMALS: [string, "rare" | "epic" | "legendary", string][] = [
  ["white_lion", "legendary", "plains"],
  ["black_panther", "legendary", "jungle"],
  ["albino_crocodile", "epic", "water"],
  ["golden_eagle", "epic", "mountains"],
  ["celestial_deer", "legendary", "forest"],
  ["obsidian_wolf", "legendary", "forest"],
  ["crystal_peacock", "epic", "plains"],
  ["shadow_fox", "rare", "forest"],
];

export default function EpicChest() {
  const t = useTranslations("chestsfaq.epic");
  const tChest = useTranslations("chestsfaq");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/epic_chest.jpg"}>
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
            <InfoLabel>{tChest("limit")}</InfoLabel>
            <InfoValue>📦 Max. 100 {tChest("chests")}</InfoValue>
          </InfoCard>
        </InfoGrid>

        {/* Sektion: Inhalt */}
        <DetailSection>
          <SubTitle>{t("contents_title")}</SubTitle>
          <p>{t("contents_body")}</p>
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

// Dieselben einheitlichen Styles für ein stimmiges Gesamtbild
export const AccordionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

export const IntroText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

export const SubTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d5a27;
  margin: 12px 0 4px 0;
  padding-bottom: 4px;
  border-bottom: 1.5px solid rgba(45, 90, 39, 0.2);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 8px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(45, 90, 39, 0.2);

  th {
    background-color: #2d5a27;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  td {
    padding: 10px 14px;
    background-color: rgba(255, 255, 255, 0.6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const Badge = styled.span<{ rarity: "rare" | "epic" | "legendary" }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  background-color: ${({ rarity }) =>
    rarity === "rare" ? "#2b6cb0" : rarity === "epic" ? "#805ad5" : "#d69e2e"};
`;
