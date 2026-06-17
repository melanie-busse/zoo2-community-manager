"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { Animal } from "@/types/animal";
import XPBadge from "@/components/ui/badges/XPBadge";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import OriginBadgeList from "@/components/page-structure/Elements/OriginBadgeList";
import GameBadge from "@/components/ui/badges/GameBadge";
import { Image } from "@/types/image";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage } from "@/utils/BiomeUtil";
import PopularityBadge from "@/components/ui/badges/PopularityBadge";
import StatBox from "@/components/page-structure/Elements/StatBox";
import BoxWithHeadline from "@/components/page-structure/Elements/BoxWithHeadline";
import ImageBadge from "@/components/ui/badges/ImageBadge";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";

interface HeaderCardProps {
  animal: Animal | null;
}

export default function HeaderCard({ animal }: HeaderCardProps) {
  const tAnimals = useTranslations("Animals");
  const tBiome = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  if (!animal) return null;

  const displayName = animal.animaltext?.[0]?.animalName || "Unknown";
  const rawPriceType = animal.priceType?.name;
  const badgeType: "Zoodollar" | "Diamond" = rawPriceType === "Diamond" ? "Diamond" : "Zoodollar";

  const biomeImage: Image = {
    name: "Biome Icon",
    path: `/images/biomes/${animal.biome?.identifier}/enclosure.webp`,
    alt: `${animal.biome?.name || "Unknown"} Biome`,
  };

  return (
    <DesktopCardContainer>
      {/* Links/Oben: Das quadratische Tierbild */}
      <ImageWrapper>
        <ImageBadge animal={animal} />
      </ImageWrapper>

      {/* Rechts/Unten: Die kompletten Text-Informationen & Stats */}
      <InfoSection>
        <TitleRow>
          <TextContent>
            <TitleHeadlineRow>
              <h1>{displayName}</h1>
              <OriginRow>
                <OriginBadgeList animal={animal} />
              </OriginRow>
            </TitleHeadlineRow>

            <ReleaseDate>
              <span className="label">📅 {tCommon("release")}:</span>{" "}
              <span className="date">
                <FormattedDate
                  date={animal.releaseDate}
                  options={{ month: "long", day: "numeric" }}
                />
              </span>
            </ReleaseDate>
          </TextContent>
        </TitleRow>

        <StatsGrid>
          {/* Column 1: Purchase Price & Popularity */}
          <StatsGroup>
            <StatBox>
              <label>{tCommon("price")}</label>
              <PriceBadge value={animal.price || 0} type={badgeType} />
            </StatBox>
            <StatBox>
              <label>{tCommon("popularity")}</label>
              <PopularityBadge popularity={animal.popularity} />
            </StatBox>
          </StatsGroup>

          {/* Column 2: Selling Value & Release XP */}
          <StatsGroup>
            <StatBox>
              <label>{tCommon("selling_price")}</label>
              <PriceBadge value={animal.sellingPrice || 0} type="Zoodollar" />
            </StatBox>
            <StatBox>
              <label>{tAnimals("release")}</label>
              <XPBadge label={animal.releaseExp} />
            </StatBox>
          </StatsGroup>

          {/* Column 3: Biome / Shelter Details */}
          <EnclosureBox label={tBiome("enclosure")}>
            <GameBadge image={biomeImage} size={45} />
            <ShelterLevelBadge
              image={getShelterImage(animal.biome)}
              level={animal.shelterLevel}
              habitat={animal.biome?.name}
              size={45}
              showTooltip={true}
            />
          </EnclosureBox>
        </StatsGrid>
      </InfoSection>
    </DesktopCardContainer>
  );
}

// --- Styled Components ---
const DesktopCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  gap: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: center;
    /* Nutzt exakt dieselbe Breite wie das MainGrid darunter */
    width: calc(100% - 16px);
    margin-left: auto;
    margin-right: auto;
    padding: 16px;
    gap: 16px;
  }
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    border-radius: 12px;
    overflow: hidden;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
    margin-bottom: 20px;
  }
`;

const TitleHeadlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const OriginRow = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ReleaseDate = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    color: #2d5a27;
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr) minmax(180px, 1.2fr);
    justify-content: start;
    gap: 15px;
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;

    & > :last-child {
      grid-column: span 2;
    }
  }

  /* Mobil: Schaltet das Grid komplett ab, damit die Gruppen stur untereinander fließen */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;

  & > * {
    flex: 1;
  }

  @media (min-width: 768px) {
    flex-direction: column;
  }

  /* Mobil: Erzwingt, dass die beiden Boxen einer Gruppe untereinander stehen (eine pro Zeile) */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const EnclosureBox = styled(BoxWithHeadline)`
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 4px;
  }
`;
