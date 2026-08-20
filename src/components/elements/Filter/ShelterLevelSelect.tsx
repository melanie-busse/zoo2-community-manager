"use client";

import React from "react";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage, extractUniqueShelterLevels } from "@/utils/BiomeUtil";

interface WithShelterLevel {
  shelterLevel?: number | null;
}

interface ShelterLevelSelectProps {
  items: WithShelterLevel[];
  selectedShelterLevel: number | string | null;
  onChange: (level: number | string | null) => void;
}

export function ShelterLevelSelect({
  items,
  selectedShelterLevel,
  onChange,
}: ShelterLevelSelectProps) {
  const uniqueLevels = extractUniqueShelterLevels(items);

  const grasslandBiome = {
    identifier: "grassland",
    biomestext: [{ biomeName: "Grasland" }],
  } as any;

  return (
    <SelectBoxWithImage<WithShelterLevel>
      items={uniqueLevels}
      selectedValue={selectedShelterLevel !== null ? String(selectedShelterLevel) : "all"}
      onSelectAction={(val) => onChange(val === "all" ? null : val)}
      allLabelKey="all_levels"
      labelPrefixKey="level_label"
      getIdentifier={(item) => String(item.shelterLevel)}
      renderBadge={(item) => (
        <Styles.ScaledBadge>
          <ShelterLevelBadge
            image={getShelterImage(grasslandBiome)}
            level={Number(item.shelterLevel)}
            habitat="grassland"
            showTooltip={false}
            size={60}
          />
        </Styles.ScaledBadge>
      )}
    />
  );
}