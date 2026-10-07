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
  unlocklevel?: number;
}

export default function BuildingCard({ title, icon, imagePath, building, unlocklevel }: BuildingCardProps) {
  const tCommon = useTranslations("common");
  const tRegion = useTranslations("region");

  return (
    <InfoAccordion title={title} icon={icon} defaultOpen={true}>
      <CardBody>
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
          <PriceRow>
            {unlocklevel !== undefined && (
              <>
                <label>{tRegion("unlock_level")}</label>
                <strong style={{ fontSize: "0.9rem", marginBottom: "8px" }}>{tRegion("level_value", { level: unlocklevel })}</strong>
              </>
            )}
            <label>{tCommon("price")}</label>
            <CurrencyBadge value={building.price} type={toCurrencyType(building.pricetype)} />
          </PriceRow>
        )}
      </CardBody>
    </InfoAccordion>
  );
}

const CardBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 16px;
`;

const PriceRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  label {
    font-size: 0.8rem;
    color: #666;
  }
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;
