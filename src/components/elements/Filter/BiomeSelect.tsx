"use client";

import React from "react";
import { getBiomeName, getBiomeImage, extractUniqueBiomes } from "@/utils/BiomeUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import { Biome } from "@/types/biome";

interface BiomeSelectProps<T extends { biome?: Biome | null }> {
  items: T[];
  selectedBiome: string | null;
  onChange: (value: string | null) => void;
  allLabelKey?: string;
}

export function BiomeSelect<T extends { biome?: Biome | null }>({
  items,
  selectedBiome,
  onChange,
  allLabelKey = "all_enclosures",
}: BiomeSelectProps<T>) {
  const uniqueBiomes = extractUniqueBiomes(items);

  return (
    <SelectBoxWithImage<Biome>
      items={uniqueBiomes}
      selectedValue={selectedBiome ?? "all"}
      onSelectAction={(val) => onChange(val === "all" ? null : val)}
      allLabelKey={allLabelKey}
      getIdentifier={(biome) => getBiomeName(biome, "")}
      renderBadge={(biome) => (
        <BiomeBadge image={getBiomeImage(biome)} size={20} showTooltip={false} />
      )}
    />
  );
}