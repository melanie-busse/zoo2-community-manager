"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";

import { Collection } from "@/types/collection";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import PolaroidBadge from "@/components/ui/badges/PolaroidBadge";

const StarsRow = styled.div`
  display: flex;
  gap: 2px;
  font-size: 1rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${({ $filled }) => ($filled ? "#f6c90e" : "rgba(0,0,0,0.15)")};
`;

const RegionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RegionName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
`;

const RequirementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 32px;
  justify-content: center;
  margin-top: 40px;
`;

interface CollectionCardProps {
  collection: Collection;
}

function getRequirementImageSrc(req: Collection["requirements"][number]): string | null {
  if (
    req.specialCoat?.identifier &&
    req.specialCoat.animal?.identifier &&
    req.specialCoat.animal.biome?.identifier
  ) {
    const animalId = req.specialCoat.animal.identifier;
    const coatFolder = req.specialCoat.identifier!.slice(animalId.length + 1);
    return `/images/animals/${req.specialCoat.animal.biome.identifier}/${animalId}/specialcoats/${coatFolder}/image.jpg`;
  }
  if (req.animal?.identifier && req.animal.biome?.identifier) {
    if (req.type === "DECORATION") {
      return `/images/animals/${req.animal.biome.identifier}/${req.animal.identifier}/statue/image.webp`;
    }
    return `/images/animals/${req.animal.biome.identifier}/${req.animal.identifier}/image.jpg`;
  }
  return null;
}

function getRequirementLabel(req: Collection["requirements"][number]): {
  name: string;
  color?: string;
} {
  if (req.specialCoat) {
    const text = req.specialCoat.specialcoatstext?.[0];
    return { name: text?.name ?? req.itemName, color: text?.color };
  }
  if (req.animal) {
    return { name: req.animal.name ?? req.itemName };
  }
  return { name: req.itemName };
}

function getRewardLabel(collection: Collection): { name: string; color?: string } {
  const coat = collection.rewardSpecialCoat;
  if (coat?.identifier && coat.animal?.identifier && coat.animal.biome?.identifier) {
    const text = coat.specialcoatstext?.[0];
    return { name: text?.name ?? coat.identifier ?? collection.name, color: text?.color };
  }
  if (collection.rewardAnimal?.identifier) {
    return {
      name: collection.rewardAnimal.name ?? collection.rewardAnimal.identifier ?? collection.name,
    };
  }
  return { name: collection.name };
}

function getAnimalImageSrc(collection: Collection): string {
  // Special Coat als Belohnung hat Priorität
  const coat = collection.rewardSpecialCoat;
  if (coat?.identifier && coat.animal?.identifier && coat.animal.biome?.identifier) {
    const animalId = coat.animal.identifier;
    const coatFolder = coat.identifier!.slice(animalId.length + 1);
    return `/images/animals/${coat.animal.biome.identifier}/${animalId}/specialcoats/${coatFolder}/image.jpg`;
  }
  if (collection.rewardAnimal?.identifier && collection.rewardAnimal.biome?.identifier) {
    return `/images/animals/${collection.rewardAnimal.biome.identifier}/${collection.rewardAnimal.identifier}/image.jpg`;
  }
  return getRequirementImageSrc(collection.requirements[0]) ?? "/placeholder.png";
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const animalImageSrc = getAnimalImageSrc(collection);
  const { name: rewardName, color: rewardColor } = getRewardLabel(collection);

  return (
    <CardContainer>
      <CardHeaderRow>
        <RegionRow>
          <Image
            src={`/images/regions/${collection.region.identifier.toLowerCase()}/icon.jpg`}
            alt={collection.region.name}
            width={24}
            height={24}
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
          <RegionName>{collection.region.name}</RegionName>
        </RegionRow>
        <StarsRow>
          {[1, 2, 3].map((s) => (
            <Star key={s} $filled={s <= collection.stars}>
              ★
            </Star>
          ))}
        </StarsRow>
      </CardHeaderRow>

      <CardDivider />
      <PolaroidBadge
        animalImageSrc={animalImageSrc}
        animalName={collection.name}
        rewardName={rewardName}
        rewardColor={rewardColor}
      />

      <RequirementsGrid>
        {collection.requirements.map((req) => {
          const src = getRequirementImageSrc(req);
          if (!src) return null;
          const { name, color } = getRequirementLabel(req);
          return (
            <PolaroidBadge
              key={req.id}
              animalImageSrc={src}
              animalName={name}
              rewardName={name}
              rewardColor={color}
              level={req.requiredLevel ?? undefined}
              cardWidth={110}
            />
          );
        })}
      </RequirementsGrid>
    </CardContainer>
  );
}
