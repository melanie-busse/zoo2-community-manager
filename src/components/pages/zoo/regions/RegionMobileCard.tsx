"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import { Name } from "@/components/elements/Name/Name";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import styled from "styled-components";

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
`;

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

export default function RegionMobileCard({ region }: { region: Region }) {
  const t = useTranslations("region");
  const tCommon = useTranslations("common");
  const name = region.regionTexts[0]?.name ?? region.identifier;
  const imgSrc = `/images/regions/${region.identifier}/icon.jpg`;

  return (
    <CardContainer>
      <CardHeaderRow>
        <Name>{name}</Name>
        <Image src={imgSrc} alt={name} width={48} height={48} style={{ objectFit: "cover", borderRadius: 4 }} />
      </CardHeaderRow>
      <CardDivider />
      <CardStatsRow>
        <InfoRow>
          <span>{tCommon("price")}</span>
          <CurrencyBadge value={region.price} type="Diamond" />
        </InfoRow>
        <InfoRow>
          <span>{t("unlock_level")}</span>
          <span>{t("level_value", { level: region.unlocklevel })}</span>
        </InfoRow>
        <InfoRow>
          <span>{t("breeding_slots")}</span>
          <span>{region._count.breedingCenterSlots}</span>
        </InfoRow>
      </CardStatsRow>
    </CardContainer>
  );
}
