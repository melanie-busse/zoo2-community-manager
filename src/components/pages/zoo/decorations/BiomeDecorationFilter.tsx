"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import { getBiomeImage, getBiomeName } from "@/utils/BiomeUtil";
import { useDecorationStore } from "@/store/useDecorationStore";
import type { BiomeSummary } from "./BiomeDecorationOverviewContent";

interface BiomeDecorationFilterProps {
  biomes: BiomeSummary[];
}

export default function BiomeDecorationFilter({ biomes }: BiomeDecorationFilterProps) {
  const t = useTranslations("decoration");

  const allDecorations = useDecorationStore((state) => state.allDecorations);
  const searchTerm = useDecorationStore((state) => state.searchTerm);
  const setSearchTerm = useDecorationStore((state) => state.setSearchTerm);
  const selectedBiomeIdentifier = useDecorationStore((state) => state.selectedBiomeIdentifier);
  const setSelectedBiomeIdentifier = useDecorationStore((state) => state.setSelectedBiomeIdentifier);

  const availableBiomes = useMemo(() => {
    const usedIdentifiers = new Set(allDecorations.map((d) => d.biome.identifier));
    return biomes
      .filter((b) => usedIdentifiers.has(b.identifier))
      .sort((a, b) => a.identifier.localeCompare(b.identifier));
  }, [allDecorations, biomes]);

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
