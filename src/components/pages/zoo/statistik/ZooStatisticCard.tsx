"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { BiomeStatistic } from "@/types/zooStatistic";

// Wiederverwendung deiner Seiten- & Card-Strukturkomponenten
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";

const BiomeTitle = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

// Hilfs-Layouts für die strukturierte Statistik-Darstellung
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

const BadgeGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-wrap: wrap;
  align-items: center;
`;

interface ZooStatisticCardProps {
  stat: BiomeStatistic;
}

export default function ZooStatisticCard({ stat }: ZooStatisticCardProps) {
  const t = useTranslations("zooStatistic");
  const shelterLevels = [0, 1, 2, 3];
  const id = stat.biomeIdentifier;
  const biomeImage = { name: id, path: `/images/biomes/${id}/area.webp`, alt: stat.biomeName };
  const shelterImage = { name: id, path: `/images/biomes/${id}/shelter.png`, alt: stat.biomeName };

  return (
    <CardContainer>
      <CardHeaderRow>
        <div>
          <BiomeTitle>{stat.biomeName} </BiomeTitle>
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
          <StatRow>
            <span>{t("animals.total")}</span>
            <strong>{stat.totalAnimals}</strong>
          </StatRow>
          <StatRow>
            <span>{t("animals.specialCoats")}</span>
            <strong>{stat.totalSpecialCoats}</strong>
          </StatRow>

          <StatRow>
            <span>{t("animals.zoodollar")}</span>
            <strong>{stat.animalsForZoodollar}</strong>
          </StatRow>
          <StatRow>
            <span>{t("animals.diamond")}</span>
            <strong>{stat.animalsForDiamond}</strong>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("contest.title")}</SectionTitle>
          <StatRow>
            <span>{t("contest.contestAnimals")}</span>
            <strong>{stat.contestSpecialCoats}</strong>
          </StatRow>
          <StatRow>
            <span>{t("contest.statues")}</span>
            <strong>{stat.contestStatues}</strong>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <BadgeGrid style={{ marginTop: "4px", justifyContent: "space-between", width: "100%" }}>
            {shelterLevels.map((level) => {
              const count = stat.shelterLevelCounts[level] ?? 0;
              return (
                <div key={level} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShelterLevelBadge image={shelterImage} level={level} habitat={id} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>× {count}</span>
                </div>
              );
            })}
          </BadgeGrid>
        </StatSection>
      </CardStatsRow>
    </CardContainer>
  );
}
