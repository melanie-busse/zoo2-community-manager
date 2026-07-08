"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";
import OriginBadge from "@/components/ui/badges/OriginBadge";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import FormattedDate from "@/components/ui/Formatted/FormattedDate";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";

export default function SpecialCoatHeaderCard() {
  const tCommon = useTranslations("Common");
  const tSpecialCoat = useTranslations("SpecialCoat");

  const specialCoat = useSpecialCoatStore((state) => state.selectedSpecialCoat);
  if (!specialCoat) return null;

  const text = specialCoat.specialcoatstext?.[0];
  const displayName = text?.name || "Unknown";
  const displayColor = text?.color || "";
  const origins = specialCoat.specialcoatsorigin || [];

  const imagePath = specialCoat.image
    ? `/images/specialCoat/${specialCoat.image}`
    : "/images/placeholder.jpg";

  return (
    <Styles.DesktopCardContainer>
      <Styles.ImageWrapper>
        <CoatImageContainer>
          <CoatImage src={imagePath} alt={displayName} width={240} height={240} priority />
        </CoatImageContainer>
      </Styles.ImageWrapper>

      <Styles.InfoSection>
        <Styles.TitleRow>
          <Styles.TextContent>
            <Styles.TitleHeadlineRow>
              <h1>{displayName}</h1>
              <Styles.OriginRow>
                {origins.map((item, index) => {
                  if (!item.origin) return null;
                  return (
                    <Tooltip key={item.id ?? index} text={item.origin.name} position="top">
                      <OriginBadge animalOrigin={item as any} />
                    </Tooltip>
                  );
                })}
              </Styles.OriginRow>
            </Styles.TitleHeadlineRow>

            {displayColor && (
              <ColorBadge>
                🎨 {tSpecialCoat("color")}: <span>{displayColor}</span>
              </ColorBadge>
            )}

            <Styles.ReleaseDate>
              <span className="label">📅 {tCommon("release")}:</span>{" "}
              <span className="date">
                <FormattedDate
                  date={specialCoat.releaseDate}
                  options={{ month: "long", day: "numeric" }}
                />
              </span>
            </Styles.ReleaseDate>
          </Styles.TextContent>
        </Styles.TitleRow>
      </Styles.InfoSection>
    </Styles.DesktopCardContainer>
  );
}

const CoatImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 240px;
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

const CoatImage = styled(NextImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ColorBadge = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #555;

  span {
    font-weight: 600;
    color: #2d5a27;
  }
`;