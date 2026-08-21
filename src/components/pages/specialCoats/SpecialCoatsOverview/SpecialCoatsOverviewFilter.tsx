import React from "react";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { ContestOnlyCheckbox } from "@/components/elements/Filter/ContestOnlyCheckbox";
import { useTranslations } from "next-intl";

export default function SpecialCoatsOverviewFilter() {
  const tCommon = useTranslations("common");
  const allSpecialCoats = useSpecialCoatStore((state) => state.allSpecialCoats);
  const searchTerm = useSpecialCoatStore((state) => state.searchTerm);
  const setSearchTerm = useSpecialCoatStore((state) => state.setSearchTerm);
  const selectedBiome = useSpecialCoatStore((state) => state.selectedBiome);
  const setSelectedBiome = useSpecialCoatStore((state) => state.setSelectedBiome);
  const selectedShelterLevel = useSpecialCoatStore((state) => state.selectedShelterLevel);
  const setSelectedShelterLevel = useSpecialCoatStore((state) => state.setSelectedShelterLevel);
  const contestOnly = useSpecialCoatStore((state) => state.contestOnly);
  const setContestOnly = useSpecialCoatStore((state) => state.setContestOnly);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <BiomeSelect
        items={allSpecialCoats.map((c) => ({ biome: c.animal?.biome }))}
        selectedBiome={selectedBiome}
        onChange={setSelectedBiome}
      />
      <ShelterLevelSelect
        items={allSpecialCoats.map((c) => ({ shelterLevel: c.animal?.shelterLevel }))}
        selectedShelterLevel={selectedShelterLevel}
        onChange={(val) => setSelectedShelterLevel(val !== null ? Number(val) : null)}
      />
      <FilterRow>
        <ContestOnlyCheckbox checked={contestOnly} onChange={setContestOnly} />
      </FilterRow>
    </FilterCard>
  );
}
