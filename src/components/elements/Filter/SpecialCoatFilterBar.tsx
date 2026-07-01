"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import CustomBadgeFilter from "./CustomBadgeFilter";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";

import { useSpecialCoatStore, InventoryStatusFilter } from "@/store/useSpecialCoatStore";
import { Biome } from "@/types/biome";
import { SpecialCoat } from "@/types/specialCoat";
import { getBiomeImage, getBiomeName, getShelterImage } from "@/utils/BiomeUtil";

export interface InventoryStatusItem {
  id: "ready" | "missing_partner" | "not_owned";
  labelKey: string;
  color: "green" | "yellow" | "red";
}

const INVENTORY_STATUS_ITEMS: InventoryStatusItem[] = [
  { id: "ready", labelKey: "ready", color: "green" },
  { id: "missing_partner", labelKey: "missing_partner", color: "yellow" },
  { id: "not_owned", labelKey: "not_owned", color: "red" },
];

export default function SpecialCoatFilterBar() {
  const t = useTranslations();

  // Zustand Werte & Setter laden
  const allInitialItems = useSpecialCoatStore((state) => state.allSpecialCoats);
  const searchQuery = useSpecialCoatStore((state) => state.searchQuery);
  const selectedBiomeId = useSpecialCoatStore((state) => state.selectedBiomeId);
  const selectedShelterLevel = useSpecialCoatStore((state) => state.selectedShelterLevel);
  const inventoryStatus = useSpecialCoatStore((state) => state.inventoryStatus);

  const setSearchQuery = useSpecialCoatStore((state) => state.setSearchQuery);
  const setBiomeFilter = useSpecialCoatStore((state) => state.setBiomeFilter);
  const setShelterLevelFilter = useSpecialCoatStore((state) => state.setShelterLevelFilter);
  const setInventoryStatus = useSpecialCoatStore((state) => state.setInventoryStatusFilter);

  const uniqueBiomes = Array.from(
    new Map(
      allInitialItems
        .map((coat) => coat.animal?.biome)
        .filter((b): b is Biome => b !== null && b !== undefined)
        .map((b) => [b.id, b]),
    ).values(),
  );

  const uniqueLevels = Array.from(
    new Map(
      allInitialItems
        .filter(
          (coat) => coat.animal?.shelterLevel !== null && coat.animal?.shelterLevel !== undefined,
        )
        .map((coat) => [coat.animal!.shelterLevel, coat]),
    ).values(),
  ).sort((a, b) => (a.animal!.shelterLevel ?? 0) - (b.animal!.shelterLevel ?? 0));

  const currentBiomeName = uniqueBiomes.find((b) => b.id === selectedBiomeId)
    ? getBiomeName(uniqueBiomes.find((b) => b.id === selectedBiomeId)!, "")
    : "all";

  return (
    <Styles.FilterBar>
      <Styles.SearchInput
        type="text"
        placeholder={t("Filter.search_placeholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <CustomBadgeFilter<InventoryStatusItem>
        items={INVENTORY_STATUS_ITEMS}
        selectedValue={inventoryStatus}
        onSelectAction={(value) => setInventoryStatus(value as InventoryStatusFilter)}
        allLabelKey="all_status"
        labelPrefixKey="status_prefix"
        getIdentifier={(item) => item.id}
        getLabelKey={(item) => item.labelKey}
        renderBadge={(item) => <Styles.StatusDot $color={item.color} />}
      />

      <CustomBadgeFilter<Biome>
        items={uniqueBiomes}
        selectedValue={currentBiomeName}
        onSelectAction={(val) => {
          if (val === "all") {
            setBiomeFilter(null);
          } else {
            const found = uniqueBiomes.find((b) => getBiomeName(b, "") === val);
            setBiomeFilter(found ? found.id : null);
          }
        }}
        allLabelKey="all_enclosures"
        getIdentifier={(biome) => getBiomeName(biome, "")}
        renderBadge={(biome) => (
          <BiomeBadge image={getBiomeImage(biome)} size={20} showTooltip={false} />
        )}
      />

      <CustomBadgeFilter<SpecialCoat>
        items={uniqueLevels}
        selectedValue={selectedShelterLevel !== null ? String(selectedShelterLevel) : "all"}
        onSelectAction={(val) => {
          if (val === "all") {
            setShelterLevelFilter(null);
          } else {
            setShelterLevelFilter(Number(val));
          }
        }}
        allLabelKey="all_levels"
        labelPrefixKey="level_label"
        getIdentifier={(coat) => String(coat.animal!.shelterLevel)}
        renderBadge={(coat) => {
          const grasslandBiome = {
            identifier: "grassland",
            biomestext: [{ biomeName: "Grasland" }],
          } as any;

          return (
            <Styles.ScaledBadge>
              <ShelterLevelBadge
                image={getShelterImage(grasslandBiome)}
                level={Number(coat.animal!.shelterLevel)}
                habitat="grassland"
                showTooltip={false}
                size={60}
              />
            </Styles.ScaledBadge>
          );
        }}
      />
    </Styles.FilterBar>
  );
}
