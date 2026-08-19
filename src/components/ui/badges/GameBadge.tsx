"use client";

import React from "react";
import styled from "styled-components";
import { Image } from "@/types/image";

interface GameBadgeProps {
  image: Image;
  size?: number;
  borderColor?: string;
}

export default function GameBadge({ image, size = 50, borderColor = "#4ca64c" }: GameBadgeProps) {
  return (
    <IconFrame $size={size} $borderColor={borderColor}>
      <StyledImage
        src={image.path}
        alt={image.name}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder.jpg";
        }}
      />
    </IconFrame>
  );
}

interface StyledFrameProps {
  $size: number;
  $borderColor: string;
}

const IconFrame = styled.div<StyledFrameProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: #eee;

  border: 2px solid ${({ $borderColor }) => $borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.icon};

  padding: 0;
  display: flex;
  overflow: hidden;

  box-shadow: 2px 2px 6px ${({ theme }) => theme.colors.ui.overlayDark};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  -webkit-backface-visibility: hidden;
`;
