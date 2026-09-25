"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";

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

interface InventoryStatisticCardProps {
  stat: InventoryBiomeStatistic;
}

export default function InventoryStatisticCard({ stat }: InventoryStatisticCardProps) {
  const t = useTranslations("inventoryStatistic");
  const shelterLevels = [0, 1, 2, 3];
  const id = stat.biomeIdentifier;
  const biomeImage = { name: id, path: `/images/biomes/${id}/area.webp`, alt: stat.biomeName };
  const shelterImage = { name: id, path: `/images/biomes/${id}/shelter.png`, alt: stat.biomeName };

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
          <StatRow>
            <span>{t("animals.total")}</span>
            <Fraction>
              {stat.ownedAnimals}
              <FractionSlash>/</FractionSlash>
              {stat.totalAnimals}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("animals.specialCoats")}</span>
            <Fraction>
              {stat.ownedSpecialCoats}
              <FractionSlash>/</FractionSlash>
              {stat.totalSpecialCoats}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("animals.distribution")}</span>
            <CurrencyRow>
              <span>
                Zoodollar:{" "}
                <Fraction>
                  {stat.ownedAnimalsForZoodollar}
                  <FractionSlash>/</FractionSlash>
                  {stat.animalsForZoodollar}
                </Fraction>
              </span>
              <span>
                Diamond:{" "}
                <Fraction>
                  {stat.ownedAnimalsForDiamond}
                  <FractionSlash>/</FractionSlash>
                  {stat.animalsForDiamond}
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
              {stat.ownedContestSpecialCoats}
              <FractionSlash>/</FractionSlash>
              {stat.contestSpecialCoats}
            </Fraction>
          </StatRow>
          <StatRow>
            <span>{t("contest.statues")}</span>
            <Fraction>
              {stat.ownedContestStatues}
              <FractionSlash>/</FractionSlash>
              {stat.contestStatues}
            </Fraction>
          </StatRow>
        </StatSection>
      </CardStatsRow>

      <CardDivider />

      <CardStatsRow>
        <StatSection>
          <SectionTitle>{t("shelter.title")}</SectionTitle>
          <BadgeGrid style={{ marginTop: "4px", justifyContent: "space-between", width: "100%" }}>
            {shelterLevels.map((level) => {
              const owned = stat.ownedShelterLevelCounts[level] ?? 0;
              const total = stat.shelterLevelCounts[level] ?? 0;
              return (
                <div key={level} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShelterLevelBadge image={shelterImage} level={level} habitat={id} />
                  <Fraction style={{ fontSize: "0.85rem" }}>
                    {owned}
                    <FractionSlash>/</FractionSlash>
                    {total}
                  </Fraction>
                </div>
              );
            })}
          </BadgeGrid>
        </StatSection>
      </CardStatsRow>
    </CardContainer>
  );
}