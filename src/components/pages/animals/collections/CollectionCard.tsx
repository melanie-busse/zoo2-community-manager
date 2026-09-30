"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";

import { Collection } from "@/types/collection";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import PolaroidBadge from "@/components/ui/badges/PolaroidBadge";
import {
  getAnimalImageSrc,
  getRequirementImageSrc,
  getRequirementLabel,
  getRewardLabel,
} from "@/utils/CollectionUtil";

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

const SpacedDividerTop = styled.div`
  height: 1px;
  background-color: #eee;
  margin-top: 50px;
`;

const SpacedDividerBottom = styled.div`
  height: 1px;
  background-color: #eee;
  margin-bottom: 50px;
`;

const RequirementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 32px;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const animalImageSrc = getAnimalImageSrc(collection);
  const { name: rewardName, color: rewardColor } = getRewardLabel(collection);
  const rewardHref = collection.rewardSpecialCoat
    ? `/specialcoats/${collection.rewardSpecialCoat.id}`
    : collection.rewardAnimal
    ? `/animals/${collection.rewardAnimal.id}`
    : undefined;

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

      <SpacedDividerBottom />
      <PolaroidBadge
        animalImageSrc={animalImageSrc}
        animalName={collection.name}
        rewardName={rewardName}
        rewardColor={rewardColor}
        href={rewardHref}
      />

      <SpacedDividerTop />

      <RequirementsGrid>
        {collection.requirements.map((req) => {
          const src = getRequirementImageSrc(req);
          if (!src) return null;
          const { name, color } = getRequirementLabel(req);
          const href = req.specialCoat
            ? `/specialcoats/${req.specialCoat.id}`
            : req.animal
            ? `/animals/${req.animal.id}`
            : undefined;
          return (
            <PolaroidBadge
              key={req.id}
              animalImageSrc={src}
              animalName={name}
              rewardName={name}
              rewardColor={color}
              level={req.requiredLevel ?? undefined}
              cardWidth={110}
              href={href}
            />
          );
        })}
      </RequirementsGrid>
    </CardContainer>
  );
}
