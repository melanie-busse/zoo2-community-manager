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
          <StyledRegionImage src={imagePath} alt={displayName} width={240} height={240} priority />
        </RegionImageContainer>
      </Styles.ImageWrapper>

      <Styles.InfoSection>
        <Styles.TitleRow>
          <Styles.TextContent>
            <Styles.TitleHeadlineRow>
              <h1>{displayName}</h1>
            </Styles.TitleHeadlineRow>

            <Styles.ReleaseDate>
              <span className="label">📅 {tCommon("release")}:</span>{" "}
              <span className="date">
                <FormattedDate
                  date={region.releasedate}
                  options={{ year: "numeric", month: "long", day: "numeric" }}
                />
              </span>
            </Styles.ReleaseDate>
          </Styles.TextContent>
        </Styles.TitleRow>

        <Styles.StatsGrid>
          <Styles.StatsGroup>
            <StatBox>
              <label>{tCommon("price")}</label>
              <PriceBadge value={region.price} type={badgeType} />
            </StatBox>
          </Styles.StatsGroup>

          <Styles.StatsGroup>
            <StatBox>
              <label>{tRegion("unlock_level")}</label>
              <div className="value">{tRegion("level_value", { level: region.unlocklevel })}</div>
            </StatBox>
          </Styles.StatsGroup>
        </Styles.StatsGrid>
      </Styles.InfoSection>
    </Styles.DesktopCardContainer>
  );
}

const RegionImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 400px;
  margin: 0 auto;

  border-radius: 20px;
  border: 2px solid #004d4d;
  background: white;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const StyledRegionImage = styled(NextImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
