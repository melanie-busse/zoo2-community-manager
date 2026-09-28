"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { Collection } from "@/types/collection";
import CollectionCard from "./CollectionCard";

const FiltersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary["700"] : "rgba(0,0,0,0.2)")};
  background: ${({ $active }) => ($active ? "rgba(0,0,0,0.08)" : "transparent")};
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: all 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const FiltersWrapper = styled.div`
  width: 100%;
`;

type SectorArea = "MAIN_ZOO" | "TERRARIUM" | "AQUARIUM" | "NOCTARIUM" | "AVIARY";
const AREAS: SectorArea[] = ["MAIN_ZOO", "TERRARIUM", "AQUARIUM", "NOCTARIUM", "AVIARY"];
const STARS = [1, 2, 3];

interface CollectionsOverviewContentProps {
  collections: Collection[];
}

export default function CollectionsOverviewContent({
  collections,
}: CollectionsOverviewContentProps) {
  const t = useTranslations("collections");
  const [selectedArea, setSelectedArea] = useState<SectorArea | null>(null);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);

  const filtered = collections.filter((c) => {
    if (selectedArea && c.area !== selectedArea) return false;
    if (selectedStars && c.stars !== selectedStars) return false;
    return true;
  });

  return (
    <FiltersWrapper>
      <FiltersRow>
        <FilterButton $active={selectedArea === null} onClick={() => setSelectedArea(null)}>
          {t("filter.all_areas")}
        </FilterButton>
        {AREAS.map((area) => (
          <FilterButton
            key={area}
            $active={selectedArea === area}
            onClick={() => setSelectedArea(selectedArea === area ? null : area)}
          >
            {t(`area.${area}`)}
          </FilterButton>
        ))}
      </FiltersRow>

      <FiltersRow>
        <FilterButton $active={selectedStars === null} onClick={() => setSelectedStars(null)}>
          {t("filter.all_stars")}
        </FilterButton>
        {STARS.map((s) => (
          <FilterButton
            key={s}
            $active={selectedStars === s}
            onClick={() => setSelectedStars(selectedStars === s ? null : s)}
          >
            {"★".repeat(s)}
          </FilterButton>
        ))}
      </FiltersRow>

      {filtered.length === 0 ? (
        <EmptyState>{t("card.empty")}</EmptyState>
      ) : (
        <Grid>
          {filtered.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </Grid>
      )}
    </FiltersWrapper>
  );
}
