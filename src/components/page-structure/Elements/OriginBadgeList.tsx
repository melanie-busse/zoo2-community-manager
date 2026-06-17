"use client";

import React from "react";
import styled from "styled-components";
import { Animal } from "@/types/animal";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import OriginBadge from "@/components/ui/badges/OriginBadge";
import { AnimalOrigin } from "@/types/origin";

interface OriginBadgeListProps {
  animal: Animal | null;
}

export default function OriginBadgeList({ animal }: OriginBadgeListProps) {
  // Nutzt jetzt das korrekte Plural-Feld aus deinem frisch generierten Schema!
  const origins = animal?.animalorigins;

  if (!origins || origins.length === 0) return null;

  return (
    <StyledOriginBadgeList>
      {origins.map((item: AnimalOrigin, index: number) => {
        const realOrigin = item.origin;
        if (!realOrigin) return null;

        return (
          <Tooltip key={item.id || index} text={realOrigin.name} position="top">
            <OriginBadge animalOrigin={item} />
          </Tooltip>
        );
      })}
    </StyledOriginBadgeList>
  );
}

const StyledOriginBadgeList = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
