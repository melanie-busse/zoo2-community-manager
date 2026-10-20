"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import StatBox from "@/components/page-structure/Elements/StatBox";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

interface ShopLevel {
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

interface ShopHeaderCardProps {
  name: string;
  identifier: string;
  regionIdentifier: string | null;
  regionName: string | null;
  coinsPerClient: number | null;
  levels: ShopLevel[];
}

export default function ShopHeaderCard({
  name,
  identifier,
  regionIdentifier,
  regionName,
  coinsPerClient,
  levels,
}: ShopHeaderCardProps) {
  const t = useTranslations("shop");

  const imagePath = regionIdentifier
    ? `/images/regions/${regionIdentifier.toLowerCase()}/shops/${identifier}/image.jpg`
    : null;

  const level0 = levels.find((l) => l.level === 0);

  return (
    <Styles.DesktopCardContainer>
      {imagePath && (
        <Styles.ImageWrapper>
          <ImageContainer>
            <ShopImage
              src={imagePath}
              alt={name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </ImageContainer>
        </Styles.ImageWrapper>
      )}

      <InfoSection>
        <TitleBlock>
          <h1>{name}</h1>
          {regionName && <RegionLabel>{regionName}</RegionLabel>}
        </TitleBlock>

        <StatsRow>
          {coinsPerClient != null && (
            <StatBox>
              <label>{t("coins_per_client")}</label>
              <div className="value">{coinsPerClient}</div>
            </StatBox>
          )}
          {level0 && (
            <StatBox>
              <label>{t("price")}</label>
              <div className="value">
                <CurrencyBadge value={level0.cost} type={toCurrencyType(level0.currency)} />
              </div>
            </StatBox>
          )}
          {level0 && (
            <StatBox>
              <label>{t("build_time")}</label>
              <div className="value">{level0.buildTime || "—"}</div>
            </StatBox>
          )}
        </StatsRow>
      </InfoSection>
    </Styles.DesktopCardContainer>
  );
}

const ImageContainer = styled.div`
  width: 120px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShopImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`;

const TitleBlock = styled.div`
  h1 {
    color: #2d5a27;
    margin: 0 0 4px 0;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;

const RegionLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 100px;
  }
`;
