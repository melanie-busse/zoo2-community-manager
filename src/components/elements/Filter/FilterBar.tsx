"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import CustomBadgeFilter from "@/components/elements/Filter/CustomBadgeFilter";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { Biome } from "@/types/biome";
import { getBiomeImage, getBiomeName, getShelterImage } from "@/utils/BiomeUtil";
import { useAnimalStore } from "@/store/useAnimalStore";

interface FilterBarProps {
  showBiomeFilter?: boolean;
  showLevelFilter?: boolean;
}

export default function FilterBar({
  showBiomeFilter = true,
  showLevelFilter = true,
}: FilterBarProps) {
  const t = useTranslations();

 const allAnimals = useAnimalStore((state) => state.allAnimals);
  const searchTerm = useAnimalStore((state) => state.searchTerm);
  const selectedBiome = useAnimalStore((state) => state.selectedBiome);
  const selectedLevel = useAnimalStore((state) => state.selectedLevel);

  const setSearchTerm = useAnimalStore((state) => state.setSearchTerm);
  const setSelectedBiome = useAnimalStore((state) => state.setSelectedBiome);
  const setSelectedLevel = useAnimalStore((state) => state.setSelectedLevel);

  const uniqueBiomes = Array.from(
    new Map(
      allAnimals
        .map((a) => a.biome)
        .filter((b): b is Biome => b !== null && b !== undefined)
        .map((b) => [b.id, b]),
    ).values(),
  );

  const uniqueLevels = Array.from(
    new Map(
      allAnimals.filter((a) => a.shelterLevel !== null).map((a) => [a.shelterLevel, a]),
    ).values(),
  ).sort((a, b) => (a.shelterLevel ?? 0) - (b.shelterLevel ?? 0));

  return (
    <Styles.FilterBar>
      <Styles.SearchInput
        type="text"
        placeholder={t("Filter.search_placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {showBiomeFilter && (
        <CustomBadgeFilter
          items={uniqueBiomes}
          selectedValue={selectedBiome}
          onSelectAction={(val) => setSelectedBiome(val)}
          allLabelKey="all_enclosures"
          getIdentifier={(biome) => getBiomeName(biome, "")}
          renderBadge={(biome) => (
            <BiomeBadge image={getBiomeImage(biome)} size={20} showTooltip={false} />
          )}
        />
      )}

      {showLevelFilter && (
        <CustomBadgeFilter
          items={uniqueLevels}
          selectedValue={selectedLevel}
          onSelectAction={(val) => setSelectedLevel(val)}
          allLabelKey="all_levels"
          labelPrefixKey="level_label"
          getIdentifier={(animal) => String(animal.shelterLevel)}
          renderBadge={(animal) => {
            const grasslandBiome = {
              identifier: "grassland",
              biomestext: [{ biomeName: "Grasland" }],
            } as any;

            return (
              <Styles.ScaledBadge>
                <ShelterLevelBadge
                  image={getShelterImage(grasslandBiome)}
                  level={Number(animal.shelterLevel)}
                  habitat="grassland"
                  showTooltip={false}
                  size={60}
                />
              </Styles.ScaledBadge>
            );
          }}
        />
      )}
    </Styles.FilterBar>
  );
}
