"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { AnimalOrigin } from "@/types/origin";

interface OriginBadgeProps {
  animalOrigin: AnimalOrigin;
}

export default function OriginBadge({ animalOrigin }: OriginBadgeProps) {
  const realOrigin = animalOrigin.origin;

  // Sicherheitsnetz, falls die Relation im Service mal nicht inkludiert wurde
  if (!realOrigin) return null;

  return (
    <BadgeWrapper>
      <StyledImage
        src={`/images/origins/${realOrigin.image || "placeholder.png"}`} // Geändert zu origin/
        alt={realOrigin.name || "Origin"}
        width={32}
        height={32}
      />
    </BadgeWrapper>
  );
}

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: help;
`;

const StyledImage = styled(NextImage)`
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15));
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
