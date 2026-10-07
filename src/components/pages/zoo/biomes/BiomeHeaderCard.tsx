"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";
import StatBox from "@/components/page-structure/Elements/StatBox";
import PriceBadge from "@/components/ui/badges/PriceBadge";

interface Biome {
  identifier: string;
  price: number | null;
  expansionsCost: number | null;
  size: number | null;
  biomestext: { biomeName: string }[];
  priceType: { name: string } | null;
}

interface BiomeHeaderCardProps {
  biome: Biome;
}

export default function BiomeHeaderCard({ biome }: BiomeHeaderCardProps) {
  const t = useTranslations("biome");

  const displayName = biome.biomestext[0]?.biomeName ?? biome.identifier;
  const imagePath = `/images/biomes/${biome.identifier}/area.webp`;
  const badgeType: "Zoodollar" | "Diamond" =
    biome.priceType?.name === "Diamond" ? "Diamond" : "Zoodollar";

  return (
    <Styles.DesktopCardContainer>
      <Styles.ImageWrapper>
        <BiomeImageContainer>
          <StyledBiomeImage src={imagePath} alt={displayName} width={110} height={110} priority />
        </BiomeImageContainer>
      </Styles.ImageWrapper>

      <InfoSection>
        <TitleBlock>
          <h1>{displayName}</h1>
        </TitleBlock>

        <Styles.StatsGrid>
          <Styles.StatsGroup>
            {biome.price != null && (
              <StatBox>
                <label>{t("price")}</label>
                <PriceBadge value={biome.price} type={badgeType} />
              </StatBox>
            )}

            {biome.expansionsCost != null && (
              <StatBox>
                <label>{t("expansion_cost")}</label>
                <PriceBadge value={biome.expansionsCost} type={badgeType} />
              </StatBox>
            )}

            {biome.size != null && (
              <StatBox>
                <label>{t("size")}</label>
                <div className="value">{biome.size}</div>
              </StatBox>
            )}
          </Styles.StatsGroup>
        </Styles.StatsGrid>
      </InfoSection>
    </Styles.DesktopCardContainer>
  );
}

const BiomeImageContainer = styled.div`
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  border-radius: 20px;
  border: 2px solid #004d4d;
  background: white;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledBiomeImage = styled(NextImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`;

const TitleBlock = styled.div`
  width: 100%;

  h1 {
    color: #2d5a27;
    margin: 0 0 4px 0;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;
