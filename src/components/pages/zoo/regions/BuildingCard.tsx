"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import StatBox from "@/components/page-structure/Elements/StatBox";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface Building {
  price: number;
  pricetype: number;
}

interface BuildingCardProps {
  title: string;
  icon: string;
  imagePath: string;
  building: Building | undefined;
}

export default function BuildingCard({ title, icon, imagePath, building }: BuildingCardProps) {
  const tCommon = useTranslations("common");

  return (
    <InfoAccordion title={title} icon={icon} defaultOpen={true}>
      <TopRow>
        <ImageWrapper>
          <NextImage
            src={imagePath}
            alt={title}
            width={240}
            height={160}
            style={{ objectFit: "cover", display: "block" }}
          />
        </ImageWrapper>

        {building && (
          <StatBox>
            <label>{tCommon("price")}</label>
            <div className="value">
              <CurrencyBadge value={building.price} type={toCurrencyType(building.pricetype)} />
            </div>
          </StatBox>
        )}
      </TopRow>
    </InfoAccordion>
  );
}

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;
