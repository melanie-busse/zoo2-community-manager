"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface BiomeGame {
  id: number;
  identifier: string;
  price: number;
  pricetype: number;
  repair: number;
  repairpricetype: number;
  texts: { name: string }[];
}

interface BiomeGameCardProps {
  biomeIdentifier: string;
  games: BiomeGame[];
}

export default function BiomeGameCard({ biomeIdentifier, games }: BiomeGameCardProps) {
  const t = useTranslations("biome");

  return (
    <InfoAccordion title={t("games")} icon="/images/icons/info.png" defaultOpen={true}>
      <GamesGrid>
        {games.map((game) => {
          const name = game.texts[0]?.name ?? game.identifier;
          const imagePath = `/images/biomes/${biomeIdentifier}/game/${game.identifier}/image.webp`;
          return (
            <GameItem key={game.id}>
              <ImageWrapper>
                <NextImage
                  src={imagePath}
                  alt={name}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
              </ImageWrapper>
              <GameInfo>
                <GameName>{name}</GameName>
                <StatRow>
                  <StatLabel>{t("price")}</StatLabel>
                  <CurrencyBadge value={game.price} type={toCurrencyType(game.pricetype)} />
                </StatRow>
                <StatRow>
                  <StatLabel>{t("repair")}</StatLabel>
                  <CurrencyBadge value={game.repair} type={toCurrencyType(game.repairpricetype)} />
                </StatRow>
              </GameInfo>
            </GameItem>
          );
        })}
      </GamesGrid>
    </InfoAccordion>
  );
}

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
`;

const GameItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const GameInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  min-width: 0;
`;

const GameName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #2d5a27;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  word-break: break-word;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
`;
