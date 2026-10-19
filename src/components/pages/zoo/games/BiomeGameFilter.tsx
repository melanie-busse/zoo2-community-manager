"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import { getBiomeImage, getBiomeName } from "@/utils/BiomeUtil";
import { useGameStore } from "@/store/useGameStore";
import type { BiomeSummary } from "./BiomeGameOverviewContent";

interface BiomeGameFilterProps {
  biomes: BiomeSummary[];
}

export default function BiomeGameFilter({ biomes }: BiomeGameFilterProps) {
  const t = useTranslations("game");

  const allGames = useGameStore((state) => state.allGames);
  const searchTerm = useGameStore((state) => state.searchTerm);
  const setSearchTerm = useGameStore((state) => state.setSearchTerm);
  const selectedBiomeIdentifier = useGameStore((state) => state.selectedBiomeIdentifier);
  const setSelectedBiomeIdentifier = useGameStore((state) => state.setSelectedBiomeIdentifier);

  const availableBiomes = useMemo(() => {
    const usedIdentifiers = new Set(allGames.map((g) => g.biomeIdentifier));
    return biomes
      .filter((b) => usedIdentifiers.has(b.identifier))
      .sort((a, b) => a.identifier.localeCompare(b.identifier));
  }, [allGames, biomes]);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t("search_placeholder")}
      />
      {availableBiomes.length > 1 && (
        <SelectBoxWithImage<BiomeSummary>
          items={availableBiomes}
          selectedValue={selectedBiomeIdentifier ?? "all"}
          onSelectAction={(val) => setSelectedBiomeIdentifier(val === "all" ? null : val)}
          allLabelKey="all_biomes"
          getIdentifier={(b) => b.identifier}
          getLabel={(b) => getBiomeName(b as any, b.identifier)}
          renderBadge={(b) => (
            <BiomeBadge
              image={getBiomeImage(b as any)}
              size={20}
              showTooltip={false}
            />
          )}
        />
      )}
    </FilterCard>
  );
}
