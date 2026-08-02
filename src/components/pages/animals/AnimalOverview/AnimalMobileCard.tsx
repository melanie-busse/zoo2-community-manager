"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import CardStatsRow from "@/components/page-structure/Card/CardStatsRow";
import CardPriceRow from "@/components/page-structure/Card/CardPriceRow";
import { CardIconsRow } from "@/components/page-structure/Card/CardIconsRow";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { useTranslations } from "next-intl";
import { useAnimalStore } from "@/store/useAnimalStore";

interface AnimalMobileCardProps {
  animal: Animal;
}

export default function AnimalMobileCard({ animal }: AnimalMobileCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const deleteAnimal = useAnimalStore((state) => state.deleteAnimal);
  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");

  if (!animal) return null;

  const isAdmin = session?.user?.role === "Director";
  const displayName = animal.animaltext?.[0]?.animalName ?? tAnimal("noName");

  return (
    <CardContainer onClick={() => router.push(`/animals/${animal.id}`)}>
      <CardHeaderRow>
        <Name>{displayName}</Name>

        {isAdmin && (
          <ActionGroupBadge
            id={animal.id}
            onEdit={() => {
              setEditingAnimal(animal);
              router.push(`/animal/${animal.id}/edit`);
            }}
            onDelete={() => deleteAnimal(animal.id, tAnimal, tCommon)}
          />
        )}
      </CardHeaderRow>

      <CardDivider />

      <CardStatsRow>
        <CardPriceRow>
          <PriceBadge
            value={animal.price ?? 0}
            type={(animal.priceType?.name ?? "Zoodollar") as CurrencyType}
          />
        </CardPriceRow>

        <CardIconsRow>
          <GameBadge image={getAnimalImage(animal)} size={50} />

          <BiomeBadge image={getBiomeImage(animal.biome)} size={35} />

          <ShelterLevelBadge
            image={getShelterImage(animal.biome)}
            level={animal.shelterLevel ?? 0}
            habitat={animal.biome?.identifier}
          />
        </CardIconsRow>
      </CardStatsRow>
    </CardContainer>
  );
}
