"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import { Image } from "@/types/image";

interface RegionBadgeProps {
  image: Image;
  showTooltip?: boolean;
  size?: number;
  label?: string;
  tooltipLabel?: string;
}

export default function RegionBadge({
  image,
  showTooltip = true,
  size = 20,
  label,
  tooltipLabel,
}: RegionBadgeProps) {
  const BadgeContent = (
    <StyledBadge>
      <NextImage
        src={image.path}
        alt={image.alt}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
      {label && <LabelText>{label}</LabelText>}
    </StyledBadge>
  );

  if (!showTooltip) return BadgeContent;

  return <Tooltip text={`${tooltipLabel}`}>{BadgeContent}</Tooltip>;
}

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  padding: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LabelText = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors?.primary["900"] || "#333"};
  text-transform: capitalize;
  white-space: nowrap;
`;
