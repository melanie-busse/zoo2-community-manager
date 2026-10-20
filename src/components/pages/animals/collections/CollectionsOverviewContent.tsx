"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { Collection, RawCollection } from "@/types/collection";
import CollectionCard from "./CollectionCard";
import CollectionsOverviewFilter from "./CollectionsOverviewFilter";
import CollectionForm from "./CollectionForm";
import { deleteCollectionOnClient } from "@/service/frontend/Collection";
import { confirmDeleteDialog } from "@/utils/alerts";

/* Angepasstes Grid für 2 größere Karten nebeneinander */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Genau 2 Spalten */
  gap: ${({ theme }) => theme.spacing(4)}; /* Etwas mehr Abstand zwischen den großen Karten */
  width: 100%;
  max-width: 1000px; /* Optional: Begrenzt die Gesamtbreite für ein sauberes Layout */
  margin: 0 auto;

  /* Auf mobilen Geräten (unter 768px) automatisch 1 Spalte */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #7aad33;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  &:hover { background: #5d8f22; }
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
  allAnimals: { id: number; identifier: string; name: string }[];
  allStatues: { id: number; animalName: string; contestName: string }[];
  allRegions: { id: number; identifier: string; name: string }[];
  allRawCollections: RawCollection[];
}

export default function CollectionsOverviewContent({
  collections,
  regions,
  isAdmin,
  allAnimals,
  allStatues,
  allRegions,
  allRawCollections,
}: CollectionsOverviewContentProps) {
  const t = useTranslations("collections");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [animalSearch, setAnimalSearch] = useState("");
  const [onlyWithStatue, setOnlyWithStatue] = useState(false);
  const [onlyWithDecoration, setOnlyWithDecoration] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editCollection, setEditCollection] = useState<RawCollection | undefined>(undefined);

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
          r.specialCoat?.specialcoatstext?.[0]?.name?.toLowerCase().includes(term)
      );
      if (!inReward && !inRequirements) return false;
    }
    if (onlyWithStatue && !c.requirements.some((r) => r.type === "DECORATION" && r.animal)) return false;
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
      {isAdmin && (
        <CreateButton
          data-testid="create-collection-btn"
          onClick={() => { setEditCollection(undefined); setFormOpen(true); }}
        >
          + {t("form.create_title")}
        </CreateButton>
      )}

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
              onEdit={isAdmin ? () => { setEditCollection(allRawCollections.find((r) => r.id === c.id)); setFormOpen(true); } : undefined}
              onDelete={isAdmin ? () => handleDelete(c.id) : undefined}
            />
          ))}
        </Grid>
      )}

      {formOpen && (
        <CollectionForm
          collection={editCollection}
          allAnimals={allAnimals}
          allStatues={allStatues}
          allRegions={allRegions}
          onClose={() => setFormOpen(false)}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  );
}
