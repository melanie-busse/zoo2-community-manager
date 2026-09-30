import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

interface PolaroidBadgeProps {
  animalImageSrc: string;
  animalName: string;
  rewardName?: string;
  rewardColor?: string;
  level?: number;
  cardWidth?: number;
  href?: string;
  completed?: boolean;
  onClick?: () => void;
}

export default function PolaroidBadge({
  animalImageSrc,
  animalName,
  rewardName,
  rewardColor,
  level,
  cardWidth = 160,
  href,
  completed,
  onClick,
}: PolaroidBadgeProps) {
  const inner = (
    <>
      <AnimalImageWrapper>
        <Image
          src={animalImageSrc}
          alt={animalName}
          fill
          sizes={`${cardWidth}px`}
          style={{ objectFit: "cover" }}
        />
        {level != null && <LevelBadge>Lv.{level}</LevelBadge>}
        {completed && (
          <CompletedOverlay>
            <CheckMark>✓</CheckMark>
          </CompletedOverlay>
        )}
      </AnimalImageWrapper>
      {rewardName && <PolaroidTitle title={rewardName}>{rewardName}</PolaroidTitle>}
      {rewardColor && <PolaroidColor title={rewardColor}>{rewardColor}</PolaroidColor>}
    </>
  );

  return (
    <PolaroidWrapper>
      {href ? (
        <PolaroidCard $width={cardWidth} $clickable as={Link} href={href}>
          {inner}
        </PolaroidCard>
      ) : onClick ? (
        <PolaroidCard $width={cardWidth} $clickable as="button" onClick={onClick} style={{ border: "none", cursor: "pointer", textAlign: "left" }}>
          {inner}
        </PolaroidCard>
      ) : (
        <PolaroidCard $width={cardWidth}>
          {inner}
        </PolaroidCard>
      )}
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

const PolaroidCard = styled.div<{ $width: number; $clickable?: boolean }>`
  background-color: #ffffff;
  padding: 8px 8px 12px 8px;
  width: ${({ $width }) => $width}px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  ${({ $clickable }) => $clickable && `cursor: pointer; &:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.25); }`}
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

const CompletedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(34, 197, 94, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const CheckMark = styled.span`
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  line-height: 1;
`;

const PolaroidTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.polaroid};
  font-size: 1.1rem; /* Caveat fällt leicht kleiner aus, daher gerne etwas größer */
  font-weight: 600; /* Statt 700 – wirkt flüssiger und nicht zu fett */
  letter-spacing: 0.01em; /* Sehr geringer Abstand, damit die Schreibschrift verbindet */
  color: #2c2c2c;
  margin: 6px 0 0 0;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PolaroidColor = styled.p`
  font-family: ${({ theme }) => theme.fonts.polaroid};
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  margin: 2px 0 0 0;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
