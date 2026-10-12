"use client";

import React, { useState } from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface BiomeDecoration {
  id: number;
  identifier: string;
  price: number;
  pricetype: number;
  popularity: number;
  texts: { name: string }[];
}

interface BiomeDecorationCardProps {
  decorations: BiomeDecoration[];
  biomeIdentifier: string;
}

function DecorationImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <DecoImageWrapper>
      <NextImage
        src={imgSrc}
        alt={alt}
        width={80}
        height={80}
        style={{ objectFit: "contain" }}
        onError={() => {
          if (imgSrc.endsWith(".webp")) setImgSrc(src.replace(".webp", ".jpg"));
        }}
      />
    </DecoImageWrapper>
  );
}

export default function BiomeDecorationCard({ decorations, biomeIdentifier }: BiomeDecorationCardProps) {
  const t = useTranslations("biome");

  return (
    <Card>
      <CardHeader>
        <ImageWrapper>
          <NextImage
            src="/images/icons/decoration.png"
            alt={t("decorations")}
            width={36}
            height={36}
            style={{ objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </ImageWrapper>
        <CardTitle>{t("decorations")}</CardTitle>
      </CardHeader>
      <DecoGrid>
        {decorations.map((deco) => {
          const name = deco.texts[0]?.name ?? deco.identifier;
          const imagePath = `/images/biomes/${biomeIdentifier}/decoration/${deco.identifier}/image.webp`;
          return (
            <DecoItem key={deco.id}>
              <DecorationImage src={imagePath} alt={name} />
              <DecoInfo>
                <DecoName>{name}</DecoName>
                <StatRow>
                  <StatLabel>{t("price")}</StatLabel>
                  <CurrencyBadge value={deco.price} type={toCurrencyType(deco.pricetype)} />
                </StatRow>
                <StatRow>
                  <StatLabel>{t("popularity")}</StatLabel>
                  <PopularityValue>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{deco.popularity}</span>
                    <NextImage
                      src="/images/icons/visitors.jpg"
                      alt={t("popularity")}
                      width={16}
                      height={16}
                      style={{ objectFit: "contain", borderRadius: 2 }}
                    />
                  </PopularityValue>
                </StatRow>
              </DecoInfo>
            </DecoItem>
          );
        })}
      </DecoGrid>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  background: white;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #2d5a27;
`;

const DecoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DecoItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const DecoImageWrapper = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const DecoInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  min-width: 0;
`;

const DecoName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #2d5a27;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  word-break: break-word;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
`;

const PopularityValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
