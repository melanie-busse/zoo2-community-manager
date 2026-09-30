"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";

import { Collection } from "@/types/collection";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import PolaroidBadge from "@/components/ui/badges/PolaroidBadge";
import {
  getAnimalImageSrc,
  getRequirementImageSrc,
  getRequirementLabel,
  getRewardLabel,
} from "@/utils/CollectionUtil";
import { toggleCollectionRequirement } from "@/service/frontend/CollectionInventoryFrontendService";

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

const RewardWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const RewardPositioner = styled.div`
  position: relative;
  display: inline-block;
`;

const CompletedStamp = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 10;
`;

interface CollectionInventoryCardProps {
  collection: Collection;
  completedIds: Set<number>;
  onToggle: (reqId: number, completed: boolean) => void;
}

export default function CollectionInventoryCard({
  collection,
  completedIds,
  onToggle,
}: CollectionInventoryCardProps) {
  const animalImageSrc = getAnimalImageSrc(collection);
  const { name: rewardName, color: rewardColor } = getRewardLabel(collection);
  const rewardHref = collection.rewardSpecialCoat
    ? `/specialcoats/${collection.rewardSpecialCoat.id}`
    : collection.rewardAnimal
      ? `/animals/${collection.rewardAnimal.id}`
      : undefined;

  const requirementsWithImages = collection.requirements.filter(
    (r) => getRequirementImageSrc(r) !== null,
  );
  const allCompleted =
    requirementsWithImages.length > 0 &&
    requirementsWithImages.every((r) => completedIds.has(r.id));

  async function handleToggle(reqId: number) {
    const newCompleted = !completedIds.has(reqId);
    onToggle(reqId, newCompleted);
    await toggleCollectionRequirement(reqId, newCompleted);
  }

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
      <RewardWrapper>
        <RewardPositioner>
          <PolaroidBadge
            animalImageSrc={animalImageSrc}
            animalName={collection.name}
            rewardName={rewardName}
            rewardColor={rewardColor}
            href={rewardHref}
          />
          {allCompleted && (
            <CompletedStamp>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/collections_complete_stamp.webp"
                alt="Completed"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </CompletedStamp>
          )}
        </RewardPositioner>
      </RewardWrapper>

      <SpacedDividerTop />

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
              completed={completedIds.has(req.id)}
              onClick={() => handleToggle(req.id)}
            />
          );
        })}
      </RequirementsGrid>
    </CardContainer>
  );
}
