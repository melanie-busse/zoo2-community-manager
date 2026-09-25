"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import { InlineStatProgress } from "@/components/page-structure/Elements/Inline-ProgressBar";

const BiomeTitle = styled.span`
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

interface InventoryStatisticCardProps {
  stat: InventoryBiomeStatistic;
}

export default function InventoryStatisticCard({ stat }: InventoryStatisticCardProps) {
  const t = useTranslations("inventoryStatistic");
  const shelterLevels = [0, 1, 2, 3];
  const id = stat.biomeIdentifier;
  const biomeImage = { name: id, path: `/images/biomes/${id}/area.webp`, alt: stat.biomeName };

  return (
    <CardContainer>
      <CardHeaderRow>
        <div>
          <BiomeTitle>{stat.biomeName}</BiomeTitle>
          <div>
            {stat.region && <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>{stat.region}</span>}
          </div>
        </div>
        <BiomeBadge image={biomeImage} size={35} />
      </CardHeaderRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("animals.title")}</SectionTitle>
          <InlineStatProgress label={t("animals.total")} current={stat.ownedAnimals} total={stat.totalAnimals} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.specialCoats")} current={stat.ownedSpecialCoats} total={stat.totalSpecialCoats} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.zoodollar")} current={stat.ownedAnimalsForZoodollar} total={stat.animalsForZoodollar} ofLabel={t("of")} />
          <InlineStatProgress label={t("animals.diamond")} current={stat.ownedAnimalsForDiamond} total={stat.animalsForDiamond} ofLabel={t("of")} />
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("contest.title")}</SectionTitle>
          <InlineStatProgress label={t("contest.contestAnimals")} current={stat.ownedContestSpecialCoats} total={stat.contestSpecialCoats} ofLabel={t("of")} />
          <InlineStatProgress label={t("contest.statues")} current={stat.ownedContestStatues} total={stat.contestStatues} ofLabel={t("of")} />
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <ShelterGrid>
            {shelterLevels.map((level, i) => {
              const owned = stat.ownedShelterLevelCounts[level] ?? 0;
              const total = stat.shelterLevelCounts[level] ?? 0;
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