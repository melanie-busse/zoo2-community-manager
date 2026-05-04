"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/ui/tooltip/Tooltip";
import { habitatColors } from "@/constants/habitatConstants";
import { Image } from "@/types/image";

interface BiomeBadgeProps {
  image: Image;
  showTooltip?: boolean;
  size?: number;
  label?: string;
  tooltipLabel?: string;
}

export default function BiomeBadge({
  image,
  showTooltip = true,
  size = 20,
  label,
  tooltipLabel,
}: BiomeBadgeProps) {
  const t = useTranslations();

  const BadgeContent = (
    <StyledBadge $biomeType={image.name}>
      <NextImage
        src={image.path}
        alt={image.alt}
        width={size}
        height={size}
        // Verhindert Layout-Shift, falls das Bild kurz lädt
        style={{ objectFit: "contain" }}
      />
      {label && <LabelText>{label}</LabelText>}
    </StyledBadge>
  );

  if (!showTooltip) return BadgeContent;

  return <Tooltip text={`${tooltipLabel}`}>{BadgeContent}</Tooltip>;
}

const StyledBadge = styled.div<{ $biomeType: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 20px;

  /* Dynamische Hintergrundfarbe basierend auf den Konstanten */
  background-color: ${({ $biomeType }) => (habitatColors[$biomeType]?.main || "#666") + "33"};

  border: 2px solid ${({ $biomeType }) => habitatColors[$biomeType]?.main || "#666"};

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const LabelText = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  /* Nutzt das globale Theme */
  color: ${({ theme }) => theme.colors?.primary["900"] || "#333"};
  text-transform: capitalize;
  white-space: nowrap;
`;
