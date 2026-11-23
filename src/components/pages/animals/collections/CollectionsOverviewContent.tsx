"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { Collection } from "@/types/collection";
import CollectionCard from "./CollectionCard";
import CollectionsOverviewFilter from "./CollectionsOverviewFilter";
import { deleteCollectionOnClient } from "@/service/frontend/Collection";
import { confirmDeleteDialog } from "@/utils/alerts";

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

interface CollectionsOverviewContentProps {
  collections: Collection[];
  regions: Region[];
  isAdmin: boolean;
}

export default function CollectionsOverviewContent({
  collections,
  regions,
  isAdmin,
}: CollectionsOverviewContentProps) {
  const t = useTranslations("collections");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [animalSearch, setAnimalSearch] = useState("");
  const [onlyWithStatue, setOnlyWithStatue] = useState(false);
  const [onlyWithDecoration, setOnlyWithDecoration] = useState(false);

  const filtered = collections.filter((c) => {
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
          r.specialCoat?.specialcoatstext?.[0]?.name?.toLowerCase().includes(term),
      );
      if (!inReward && !inRequirements) return false;
    }
    if (onlyWithStatue && !c.requirements.some((r) => r.type === "DECORATION" && r.animal))
      return false;
    if (onlyWithDecoration && !c.requirements.some((r) => r.decoration)) return false;
    return true;
  });

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteCollectionOnClient(id);
      toast.success(t("form.messages.deleteSuccess"));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <DescriptionCard>{t("description")}</DescriptionCard>
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
      />

      {filtered.length === 0 ? (
        <EmptyState>{t("card.empty")}</EmptyState>
      ) : (
        <Grid>
          {filtered.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              onEdit={isAdmin ? () => router.push(`/animals/collections/${c.id}/edit`) : undefined}
              onDelete={isAdmin ? () => handleDelete(c.id) : undefined}
            />
          ))}
        </Grid>
      )}
    </>
  );
}

const DescriptionCard = styled.p`
  width: 100%;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  margin: 0;
  margin-bottom: 24px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;

  @media (max-width: 1023px) {
    width: calc(100% - 16px);
    margin-left: auto;
    margin-right: auto;
  }
`;
