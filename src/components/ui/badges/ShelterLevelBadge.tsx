"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/ui/tooltip/Tooltip";
import GameBadge from "@/components/ui/badges/GameBadge";
import { Image } from "@/types/image";

interface ShelterLevelBadgeProps {
  image: Image;
  level: number | string;
  habitat?: string;
  showTooltip?: boolean;
  size?: number;
}

export default function ShelterLevelBadge({
  image,
  level,
  habitat = "grassland",
  showTooltip = true,
  size = 64,
}: ShelterLevelBadgeProps) {
  const t = useTranslations();

  const BadgeContent = (
    <ShelterContainer $size={size}>
      <GameBadge image={image} size={size} />
      <LevelBadgeCircle $size={size}>{level}</LevelBadgeCircle>
    </ShelterContainer>
  );

  if (!showTooltip) {
    return BadgeContent;
  }

  return (
    <Tooltip text={`${t("Tooltip.level")}: ${level}`} position="bottom">
      {BadgeContent}
    </Tooltip>
  );
}
interface StyledProps {
  $size: number;
}

const ShelterContainer = styled.div<StyledProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;

  overflow: visible !important;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const LevelBadgeCircle = styled.div<StyledProps>`
  position: absolute;
  bottom: -5px;
  right: -5px;

  ${(props) => {
    const dynamicSize = Math.max(props.$size * 0.45, 22);
    return `
      width: ${dynamicSize}px;
      height: ${dynamicSize}px;
    `;
  }}

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.system.success};
  border: 2px solid ${({ theme }) => theme.colors.ui.white};
  border-radius: 50%;

  color: ${({ theme }) => theme.colors.ui.white};
  font-weight: 900;

  font-size: ${(props) => Math.max(props.$size * 0.25, 11)}px;
  font-family: ${({ theme }) => theme.fonts.text}, sans-serif;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 5;
`;
