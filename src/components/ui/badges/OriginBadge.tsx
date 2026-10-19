"use client";

import React from "react";
import styled from "styled-components";
import { AnimalOrigin } from "@/types/origin";

interface OriginBadgeProps {
  animalOrigin: AnimalOrigin;
}

export default function OriginBadge({ animalOrigin }: OriginBadgeProps) {
  const realOrigin = animalOrigin.origin;

  if (!realOrigin?.identifier) return null;

  const imgSrc = `/images/origins/${realOrigin.identifier}/image.png`;

  return (
    <BadgeWrapper>
      <StyledImage
        src={imgSrc}
        alt={realOrigin.name || "Origin"}
        width={32}
        height={32}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          if (el.src.endsWith(".png")) {
            el.src = el.src.replace(".png", ".jpg");
          } else if (el.src.endsWith(".jpg")) {
            el.src = el.src.replace(".jpg", ".webp");
          } else {
            el.style.display = "none";
          }
        }}
      />
    </BadgeWrapper>
  );
}

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: help;
`;

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15));
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
