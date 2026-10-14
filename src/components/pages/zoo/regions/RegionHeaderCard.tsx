"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";
import StatBox from "@/components/page-structure/Elements/StatBox";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";

interface Region {
  identifier: string;
  price: number;
  unlocklevel: number;
  releasedate: Date;
  regionTexts: { name: string }[];
  priceType: { name: string } | null;
  terrainName?: string | null;
}

interface RegionHeaderCardProps {
  region: Region;
}

export default function RegionHeaderCard({ region }: RegionHeaderCardProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const displayName = region.regionTexts?.[0]?.name ?? region.identifier;
  const imagePath = `/images/regions/${region.identifier.toLowerCase()}/icon.jpg`;
  const badgeType: "Zoodollar" | "Diamond" =
    region.priceType?.name === "Diamond" ? "Diamond" : "Zoodollar";

  return (
    <Styles.DesktopCardContainer>
      <Styles.ImageWrapper>
        <RegionImageContainer>
          <StyledRegionImage src={imagePath} alt={displayName} width={50} height={50} priority />
        </RegionImageContainer>
      </Styles.ImageWrapper>

      <InfoSection>
        <TitleBlock>
          <h1>{displayName}</h1>
          <Styles.ReleaseDate>
            <span className="label">📅 {tCommon("release")}:</span>{" "}
            <span className="date">
              <FormattedDate
                date={region.releasedate}
                options={{ year: "numeric", month: "long", day: "numeric" }}
              />
            </span>
          </Styles.ReleaseDate>
        </TitleBlock>

        <MapLink
          href={`/images/regions/${region.identifier.toLowerCase()}/map.webp`}
          target="_blank"
          rel="noopener noreferrer"
          title={tRegion("map")}
        >
          <MapThumbnail
            src={`/images/regions/${region.identifier.toLowerCase()}/map.webp`}
            alt={tRegion("map")}
            width={320}
            height={160}
          />
        </MapLink>

        <StatsRow>
          <StatBox>
            <label>{tCommon("price")}</label>
            <PriceBadge value={region.price} type={badgeType} />
          </StatBox>

          <StatBox>
            <label>{tRegion("unlock_level")}</label>
            <div className="value">{tRegion("level_value", { level: region.unlocklevel })}</div>
          </StatBox>

          {region.terrainName && (
            <StatBox>
              <label>{tRegion("terrain")}</label>
              <div className="value">{region.terrainName}</div>
            </StatBox>
          )}
        </StatsRow>
      </InfoSection>
    </Styles.DesktopCardContainer>
  );
}

const RegionImageContainer = styled.div`
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

const StyledRegionImage = styled(NextImage)`
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

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: flex-start;
`;

const MapLink = styled.a`
  display: inline-block;
  border-radius: 6px;
  overflow: hidden;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
  }
`;

const MapThumbnail = styled(NextImage)`
  display: block;
  object-fit: cover;
  border-radius: 6px;
  width: 100%;
  height: auto;
`;
