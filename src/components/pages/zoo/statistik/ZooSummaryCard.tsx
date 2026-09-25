"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { BiomeStatistic } from "@/types/zooStatistic";

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

interface ZooSummaryCardProps {
  biomeStatistics: BiomeStatistic[];
}

export default function ZooSummaryCard({ biomeStatistics }: ZooSummaryCardProps) {
  const t = useTranslations("zooStatistic");
  const shelterLevels = [0, 1, 2, 3];

  const totalAnimals = biomeStatistics.reduce((s, b) => s + b.totalAnimals, 0);
  const totalSpecialCoats = biomeStatistics.reduce((s, b) => s + b.totalSpecialCoats, 0);
  const totalZoodollar = biomeStatistics.reduce((s, b) => s + b.animalsForZoodollar, 0);
  const totalDiamond = biomeStatistics.reduce((s, b) => s + b.animalsForDiamond, 0);
  const totalContestStatues = biomeStatistics.reduce((s, b) => s + b.contestStatues, 0);
  const totalContestSpecialCoats = biomeStatistics.reduce((s, b) => s + b.contestSpecialCoats, 0);
  const shelterTotals = shelterLevels.map((level) =>
    biomeStatistics.reduce((s, b) => s + (b.shelterLevelCounts[level] ?? 0), 0),
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
            <strong>{totalAnimals}</strong>
          </StatRow>
          <StatRow>
            <span>{t("animals.specialCoats")}</span>
            <strong>{totalSpecialCoats}</strong>
          </StatRow>
          <StatRow>
            <span>{t("animals.zoodollar")}</span>
            <strong>{totalZoodollar}</strong>
          </StatRow>
          <StatRow>
            <span>{t("animals.diamond")}</span>
            <strong>{totalDiamond}</strong>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("contest.title")}</SectionTitle>
          <StatRow>
            <span>{t("contest.contestAnimals")}</span>
            <strong>{totalContestSpecialCoats}</strong>
          </StatRow>
          <StatRow>
            <span>{t("contest.statues")}</span>
            <strong>{totalContestStatues}</strong>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <ShelterGrid>
            {shelterLevels.map((level, i) => (
              <ShelterItem key={level}>
                <strong>{shelterTotals[i]}</strong>
                <span style={{ opacity: 0.7 }}>{t("shelter.level", { level })}</span>
              </ShelterItem>
            ))}
          </ShelterGrid>
        </StatSection>
      </CardStatsRow>
    </CardContainer>
  );
}
