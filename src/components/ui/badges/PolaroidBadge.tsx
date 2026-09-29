import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface PolaroidBadgeProps {
  animalImageSrc: string;
  animalName: string;
  rewardName?: string;
  rewardColor?: string;
  level?: number;
  cardWidth?: number;
}

export default function PolaroidBadge({
  animalImageSrc,
  animalName,
  rewardName,
  rewardColor,
  level,
  cardWidth = 160,
}: PolaroidBadgeProps) {
  return (
    <PolaroidWrapper>
      <PolaroidCard $width={cardWidth}>
        <AnimalImageWrapper>
          <Image
            src={animalImageSrc}
            alt={animalName}
            fill
            sizes={`${cardWidth}px`}
            style={{ objectFit: "cover" }}
          />
          {level != null && <LevelBadge>Lv.{level}</LevelBadge>}
        </AnimalImageWrapper>
        {rewardName && (
          <PolaroidTitle title={rewardName}>{rewardName}</PolaroidTitle>
        )}
        {rewardColor && <PolaroidColor title={rewardColor}>{rewardColor}</PolaroidColor>}
      </PolaroidCard>
    </PolaroidWrapper>
  );
}

const PolaroidWrapper = styled.div`
  align-self: center;
  position: relative;
  transform: rotate(-1deg);

  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    width: 24px;
    height: 24px;
    background-color: #e3dec9;
    border: 1px solid #c8be9f;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 24px;
    height: 24px;
    background-color: #e3dec9;
    border: 1px solid #c8be9f;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }
`;

const PolaroidCard = styled.div<{ $width: number }>`
  background-color: #ffffff;
  padding: 8px 8px 12px 8px;
  width: ${({ $width }) => $width}px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnimalImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #f1f5f9;
`;

const LevelBadge = styled.span`
  position: absolute;
  bottom: 2px;
  right: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
  line-height: 1;
  z-index: 1;
`;

const PolaroidTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: #2c2c2c;
  margin: 8px 0 0 0;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
`;

const PolaroidColor = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
  margin: 2px 0 0 0;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;