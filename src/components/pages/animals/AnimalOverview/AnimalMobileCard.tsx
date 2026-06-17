"use client";

import React from "react";
import { useSession } from "next-auth/react";

import * as Styles from "./AnimalMobileCard.styles";

import { Animal } from "@/types/animal";

import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { Name } from "@/components/elements/Name/Name";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import GameBadge from "@/components/ui/badges/GameBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { getAnimalImage } from "@/utils/AnimalUtil";
import { getBiomeImage, getShelterImage } from "@/utils/BiomeUtil";

interface AnimalMobileCardProps {
  animal: Animal;
  onClickAction: () => void;
  onEditAction: () => void;
  onDeleteAction: () => void;
}
export default function AnimalMobileCard({
  animal,
  onClickAction,
  onEditAction,
  onDeleteAction,
}: AnimalMobileCardProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  const displayName = animal.animaltext[0].animalName;

  return (
    <Styles.CardContainer onClick={onClickAction}>
      <Styles.HeaderRow>
        <Name>{displayName}</Name>
        {isAdmin && (
          <ActionGroupBadge object={animal} onEdit={onEditAction} onDelete={onDeleteAction} />
        )}
      </Styles.HeaderRow>

      <Styles.Divider />

      <Styles.StatsRow>
        <Styles.PriceRow>
          <PriceBadge
            value={animal.price ?? 0}
            type={(animal.priceType?.name ?? "Zoodollar") as CurrencyType}
          />
        </Styles.PriceRow>

        <Styles.IconsRow>
          <GameBadge image={getAnimalImage(animal)} size={50} />

          <BiomeBadge image={getBiomeImage(animal.biome)} size={35} />

          <ShelterLevelBadge
            image={getShelterImage(animal.biome)}
            level={animal.shelterLevel}
            habitat={animal.biome.identifier}
          />
        </Styles.IconsRow>
      </Styles.StatsRow>
    </Styles.CardContainer>
  );
}
