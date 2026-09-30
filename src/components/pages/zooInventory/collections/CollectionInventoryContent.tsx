"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { Collection } from "@/types/collection";
import CollectionInventoryCard from "./CollectionInventoryCard";
import CollectionsOverviewFilter from "@/components/pages/animals/collections/CollectionsOverviewFilter";
import { getRequirementImageSrc } from "@/utils/CollectionUtil";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  padding: ${({ theme }) => theme.spacing(4)};
`;

interface Region {
  id: number;
  identifier: string;
  name: string;
}

interface CollectionInventoryContentProps {
  data: { collection: Collection; completedRequirementIds: Set<number> }[];
  regions: Region[];
}

export default function CollectionInventoryContent({
  data,
  regions,
}: CollectionInventoryContentProps) {
  const t = useTranslations("collections");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [animalSearch, setAnimalSearch] = useState("");
  const [onlyWithStatue, setOnlyWithStatue] = useState(false);
  const [onlyWithDecoration, setOnlyWithDecoration] = useState(false);
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);

  const [completedMap, setCompletedMap] = useState<Map<number, Set<number>>>(() => {
    const map = new Map<number, Set<number>>();
    data.forEach(({ collection, completedRequirementIds }) => {
      map.set(collection.id, completedRequirementIds);
    });
    return map;
  });

  function isCollectionCompleted(collection: Collection, completedIds: Set<number>) {
    const withImages = collection.requirements.filter((r) => getRequirementImageSrc(r) !== null);
    return withImages.length > 0 && withImages.every((r) => completedIds.has(r.id));
  }

  function handleToggle(collectionId: number, reqId: number, completed: boolean) {
    setCompletedMap((prev) => {
      const next = new Map(prev);
      const set = new Set(next.get(collectionId) ?? []);
      if (completed) set.add(reqId);
      else set.delete(reqId);
      next.set(collectionId, set);
      return next;
    });
  }

  const filtered = data.filter(({ collection: c }) => {
    if (selectedRegionId !== null && c.region.id !== selectedRegionId) return false;
    if (selectedStars !== null && c.stars !== selectedStars) return false;
    if (animalSearch.trim()) {
      const term = animalSearch.trim().toLowerCase();
      const inReward =
        c.rewardAnimal?.name?.toLowerCase().includes(term) ||
        c.rewardSpecialCoat?.specialcoatstext?.[0]?.name?.toLowerCase().includes(term);
      const inRequirements = c.requirements.some(
        (r) =>
          r.animal?.name?.toLowerCase().includes(term) ||
          r.specialCoat?.specialcoatstext?.[0]?.name?.toLowerCase().includes(term)
      );
      if (!inReward && !inRequirements) return false;
    }
    if (onlyWithStatue && !c.requirements.some((r) => r.type === "DECORATION" && r.animal)) return false;
    if (onlyWithDecoration && !c.requirements.some((r) => r.decoration)) return false;
    if (onlyCompleted && !isCollectionCompleted(c, completedMap.get(c.id) ?? new Set())) return false;
    if (onlyOpen && isCollectionCompleted(c, completedMap.get(c.id) ?? new Set())) return false;
    return true;
  });

  return (
    <>
      <CollectionsOverviewFilter
        regions={regions}
        selectedRegionId={selectedRegionId}
        onRegionChange={setSelectedRegionId}
        selectedStars={selectedStars}
        onStarsChange={setSelectedStars}
        animalSearch={animalSearch}
        onAnimalSearchChange={setAnimalSearch}
        onlyWithStatue={onlyWithStatue}
        onOnlyWithStatueChange={setOnlyWithStatue}
        onlyWithDecoration={onlyWithDecoration}
        onOnlyWithDecorationChange={setOnlyWithDecoration}
        onlyCompleted={onlyCompleted}
        onOnlyCompletedChange={setOnlyCompleted}
        onlyOpen={onlyOpen}
        onOnlyOpenChange={setOnlyOpen}
      />

      {filtered.length === 0 ? (
        <EmptyState>{t("card.empty")}</EmptyState>
      ) : (
        <Grid>
          {filtered.map(({ collection }) => (
            <CollectionInventoryCard
              key={collection.id}
              collection={collection}
              completedIds={completedMap.get(collection.id) ?? new Set()}
              onToggle={(reqId, completed) => handleToggle(collection.id, reqId, completed)}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
