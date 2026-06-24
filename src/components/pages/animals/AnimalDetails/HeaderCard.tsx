"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

import XPBadge from "@/components/ui/badges/XPBadge";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import OriginBadgeList from "@/components/page-structure/Elements/OriginBadgeList";
import GameBadge from "@/components/ui/badges/GameBadge";
import { Image } from "@/types/image";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage } from "@/utils/BiomeUtil";
import PopularityBadge from "@/components/ui/badges/PopularityBadge";
import StatBox from "@/components/page-structure/Elements/StatBox";
import ImageBadge from "@/components/ui/badges/ImageBadge";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function HeaderCard() {
  const tAnimals = useTranslations("Animals");
  const tBiome = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  const animal = useAnimalStore((state) => state.selectedAnimal);
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
    <Styles.DesktopCardContainer>
      <Styles.ImageWrapper>
        <ImageBadge />
      </Styles.ImageWrapper>

      <Styles.InfoSection>
        <Styles.TitleRow>
          <Styles.TextContent>
            <Styles.TitleHeadlineRow>
              <h1>{displayName}</h1>
              <Styles.OriginRow>
                <OriginBadgeList />
              </Styles.OriginRow>
            </Styles.TitleHeadlineRow>

            <Styles.ReleaseDate>
              <span className="label">📅 {tCommon("release")}:</span>{" "}
              <span className="date">
                <FormattedDate
                  date={animal.releaseDate}
                  options={{ month: "long", day: "numeric" }}
                />
              </span>
            </Styles.ReleaseDate>
          </Styles.TextContent>
        </Styles.TitleRow>

        <Styles.StatsGrid>
          <Styles.StatsGroup>
            <StatBox>
              <label>{tCommon("price")}</label>
              <PriceBadge value={animal.price || 0} type={badgeType} />
            </StatBox>
            <StatBox>
              <label>{tCommon("popularity")}</label>
              <PopularityBadge popularity={animal.popularity} />
            </StatBox>
          </Styles.StatsGroup>

          <Styles.StatsGroup>
            <StatBox>
              <label>{tCommon("selling_price")}</label>
              <PriceBadge value={animal.sellingPrice || 0} type="Zoodollar" />
            </StatBox>
            <StatBox>
              <label>{tAnimals("release")}</label>
              <XPBadge label={animal.releaseExp} />
            </StatBox>
          </Styles.StatsGroup>

          <Styles.EnclosureBox label={tBiome("enclosure")}>
            <GameBadge image={biomeImage} size={45} />
            <ShelterLevelBadge
              image={getShelterImage(animal.biome)}
              level={animal.shelterLevel}
              habitat={animal.biome?.name}
              size={45}
              showTooltip={true}
            />
          </Styles.EnclosureBox>
        </Styles.StatsGrid>
      </Styles.InfoSection>
    </Styles.DesktopCardContainer>
  );
}
