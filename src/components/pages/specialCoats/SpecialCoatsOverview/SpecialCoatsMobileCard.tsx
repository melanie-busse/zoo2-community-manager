"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { Name } from "@/components/elements/Name/Name";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import GameBadge from "@/components/ui/badges/GameBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import { getBiomeImage, getShelterImage } from "@/utils/BiomeUtil";
import { SpecialCoat } from "@/types/specialCoat";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import CardPriceRow from "@/components/page-structure/Card/CardPriceRow";
import { CardIconsRow } from "@/components/page-structure/Card/CardIconsRow";
import styled from "styled-components";

interface SpecialCoatMobileCardProps {
  specialCoat: SpecialCoat;
}

export default function SpecialCoatsMobileCard({ specialCoat }: SpecialCoatMobileCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!specialCoat) return null;

  const isAdmin = session?.user?.role === "Director";
  const displayName = specialCoat.animal?.animaltext?.[0]?.animalName ?? "Kein Name vorhanden";

  return (
    <CardContainer onClick={() => router.push(`/specialcoat/${specialCoat.id}`)}>
      <CardHeaderRow>
        <Name>{displayName}</Name>
        <Color>{specialCoat.specialcoatstext?.[0]?.color ?? "Keine Farbe vorhanden"} -</Color>

        {isAdmin && <ActionGroupBadge object={specialCoat} />}
      </CardHeaderRow>

      <CardDivider />

      <CardStatsRow>
        <CardPriceRow>
          <PriceBadge
            value={specialCoat.animal?.price ?? 0}
            type={(specialCoat.animal?.priceType?.name ?? "Zoodollar") as CurrencyType}
          />
        </CardPriceRow>

        <CardIconsRow>
          <GameBadge image={getSpecialCoatImage(specialCoat)} size={50} />

          <BiomeBadge image={getBiomeImage(specialCoat.animal?.biome)} size={35} />

          <ShelterLevelBadge
            image={getShelterImage(specialCoat.animal?.biome)}
            level={specialCoat.animal?.shelterLevel || 0}
            habitat={specialCoat.animal?.biome?.identifier}
          />
        </CardIconsRow>
      </CardStatsRow>
    </CardContainer>
  );
}
const Color = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
`;
