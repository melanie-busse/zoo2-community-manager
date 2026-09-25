"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

const StatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  width: 100%;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.grey[600]};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const ShelterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing(1)};
`;

const ShelterItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;
  gap: 2px;
`;

const Fraction = styled.strong`
  white-space: nowrap;
`;

const FractionSlash = styled.span`
  font-weight: 400;
  opacity: 0.5;
  margin: 0 2px;
`;

const CurrencyRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
  font-size: 0.85rem;
`;

interface InventorySummaryCardProps {
  biomeStatistics: InventoryBiomeStatistic[];
}

export default function InventorySummaryCard({ biomeStatistics }: InventorySummaryCardProps) {
  const t = useTranslations("inventoryStatistic");
  const shelterLevels = [0, 1, 2, 3];

  const totalAnimals = biomeStatistics.reduce((s, b) => s + b.totalAnimals, 0);
  const ownedAnimals = biomeStatistics.reduce((s, b) => s + b.ownedAnimals, 0);
  const totalSpecialCoats = biomeStatistics.reduce((s, b) => s + b.totalSpecialCoats, 0);
  const ownedSpecialCoats = biomeStatistics.reduce((s, b) => s + b.ownedSpecialCoats, 0);
  const totalZoodollar = biomeStatistics.reduce((s, b) => s + b.animalsForZoodollar, 0);
  const ownedZoodollar = biomeStatistics.reduce((s, b) => s + b.ownedAnimalsForZoodollar, 0);
  const totalDiamond = biomeStatistics.reduce((s, b) => s + b.animalsForDiamond, 0);
  const ownedDiamond = biomeStatistics.reduce((s, b) => s + b.ownedAnimalsForDiamond, 0);
  const totalContestStatues = biomeStatistics.reduce((s, b) => s + b.contestStatues, 0);
  const ownedContestStatues = biomeStatistics.reduce((s, b) => s + b.ownedContestStatues, 0);
  const totalContestSpecialCoats = biomeStatistics.reduce((s, b) => s + b.contestSpecialCoats, 0);
  const ownedContestSpecialCoats = biomeStatistics.reduce(
    (s, b) => s + b.ownedContestSpecialCoats,
    0,
  );
  const regionCount = new Set(biomeStatistics.map((b) => b.region).filter(Boolean)).size;

  return (
    <CardContainer>
      <CardHeaderRow>
        <Title>{t("summary.title")}</Title>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            fontSize: "0.85rem",
            opacity: 0.7,
          }}
        >
          <span>{t("summary.biomes", { count: biomeStatistics.length })}</span>
          <span>{t("summary.regions", { count: regionCount })}</span>
        </div>
      </CardHeaderRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("animals.title")}</SectionTitle>
          <StatRow>
            <span>{t("animals.total")}</span>
            <Fraction>
              {ownedAnimals}
              <FractionSlash>/</FractionSlash>
              {totalAnimals}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("animals.specialCoats")}</span>
            <Fraction>
              {ownedSpecialCoats}
              <FractionSlash>/</FractionSlash>
              {totalSpecialCoats}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("animals.distribution")}</span>
            <CurrencyRow>
              <span>
                Zoodollar:{" "}
                <Fraction>
                  {ownedZoodollar}
                  <FractionSlash>/</FractionSlash>
                  {totalZoodollar}
                </Fraction>
              </span>
              <span>
                Diamond:{" "}
                <Fraction>
                  {ownedDiamond}
                  <FractionSlash>/</FractionSlash>
                  {totalDiamond}
                </Fraction>
              </span>
            </CurrencyRow>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("contest.title")}</SectionTitle>
          <StatRow>
            <span>{t("contest.contestAnimals")}</span>
            <Fraction>
              {ownedContestSpecialCoats}
              <FractionSlash>/</FractionSlash>
              {totalContestSpecialCoats}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("contest.statues")}</span>
            <Fraction>
              {ownedContestStatues}
              <FractionSlash>/</FractionSlash>
              {totalContestStatues}
            </Fraction>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <ShelterGrid>
            {shelterLevels.map((level) => {
              const owned = biomeStatistics.reduce(
                (s, b) => s + (b.ownedShelterLevelCounts[level] ?? 0),
                0,
              );
              const total = biomeStatistics.reduce(
                (s, b) => s + (b.shelterLevelCounts[level] ?? 0),
                0,
              );
              return (
                <ShelterItem key={level}>
                  <Fraction>
                    {owned}
                    <FractionSlash>/</FractionSlash>
                    {total}
                  </Fraction>
                  <span style={{ opacity: 0.7 }}>{t("shelter.level", { level })}</span>
                </ShelterItem>
              );
            })}
          </ShelterGrid>
        </StatSection>
      </CardStatsRow>
    </CardContainer>
  );
}