"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { InlineStatProgress } from "@/components/page-structure/Elements/Inline-ProgressBar";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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

const LEVEL_COLORS = ["#4facfe", "#b224ef", "#ff0844", "#f6d365"];

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
          <InlineStatProgress label={t("animals.total")} current={ownedAnimals} total={totalAnimals} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.specialCoats")} current={ownedSpecialCoats} total={totalSpecialCoats} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.zoodollar")} current={ownedZoodollar} total={totalZoodollar} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.diamond")} current={ownedDiamond} total={totalDiamond} ofLabel={t("of")} />
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("contest.title")}</SectionTitle>
          <InlineStatProgress label={t("contest.contestAnimals")} current={ownedContestSpecialCoats} total={totalContestSpecialCoats} ofLabel={t("of")} />
          <InlineStatProgress label={t("contest.statues")} current={ownedContestStatues} total={totalContestStatues} ofLabel={t("of")} />
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <ShelterGrid>
            {shelterLevels.map((level, i) => {
              const owned = biomeStatistics.reduce(
                (s, b) => s + (b.ownedShelterLevelCounts[level] ?? 0),
                0,
              );
              const total = biomeStatistics.reduce(
                (s, b) => s + (b.shelterLevelCounts[level] ?? 0),
                0,
              );
              const remaining = Math.max(0, total - owned);
              const data = [
                { name: "owned", value: owned },
                { name: "missing", value: remaining },
              ];
              return (
                <ShelterItem key={level}>
                  <PieChart width={80} height={80}>
                    <Pie
                      data={data}
                      cx={35}
                      cy={35}
                      innerRadius={22}
                      outerRadius={35}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill={LEVEL_COLORS[i]} />
                      <Cell fill="rgba(255,255,255,0.15)" />
                    </Pie>
                    <Tooltip
                      formatter={(_value, name) =>
                        name === "owned" ? [`${owned}/${total}`, t("shelter.level", { level })] : null
                      }
                    />
                  </PieChart>
                  <span style={{ opacity: 0.7 }}>{t("shelter.level", { level })}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    {owned}/{total}
                  </span>
                </ShelterItem>
              );
            })}
          </ShelterGrid>
        </StatSection>
      </CardStatsRow>
    </CardContainer>
  );
}
