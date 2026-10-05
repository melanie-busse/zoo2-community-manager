"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import StatBox from "@/components/page-structure/Elements/StatBox";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface BreedingCenter {
  price: number;
  pricetype: number;
}

interface BreedingCenterSlot {
  id: number;
  slot: number;
  price: number;
  pricetype: number;
}

interface BreedingCenterCardProps {
  identifier: string;
  breedingCenter: BreedingCenter | undefined;
  slots: BreedingCenterSlot[];
}

export default function BreedingCenterCard({
  identifier,
  breedingCenter,
  slots,
}: BreedingCenterCardProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const imagePath = `/images/regions/${identifier.toLowerCase()}/breedingcenter/image.webp`;

  return (
    <InfoAccordion title={tRegion("breeding_center")} icon="/images/icons/breeding.png" defaultOpen={true}>
      <TopRow>
        <ImageWrapper>
          <StyledImage
            src={imagePath}
            alt={tRegion("breeding_center")}
            width={240}
            height={160}
          />
        </ImageWrapper>

        {breedingCenter && (
          <StatBox>
            <label>{tCommon("price")}</label>
            <div className="value">
              <CurrencyBadge
                value={breedingCenter.price}
                type={toCurrencyType(breedingCenter.pricetype)}
              />
            </div>
          </StatBox>
        )}
      </TopRow>

      {slots.length > 0 && (
        <Styles.XpTable style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>{tRegion("slot")}</th>
              <th style={{ textAlign: "right" }}>{tCommon("price")}</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <Styles.TableCell style={{ textAlign: "left", fontWeight: "normal", color: "#333" }}>
                  {s.slot}
                </Styles.TableCell>
                <Styles.TableCell>
                  <CurrencyBadge value={s.price} type={toCurrencyType(s.pricetype)} />
                </Styles.TableCell>
              </tr>
            ))}
          </tbody>
        </Styles.XpTable>
      )}
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

const StyledImage = styled(NextImage)`
  display: block;
  object-fit: cover;
`;
