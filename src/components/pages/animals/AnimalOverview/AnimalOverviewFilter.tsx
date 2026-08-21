import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { StatueCheckbox } from "@/components/elements/Filter/StatueCheckbox";
import PageHeader from "@/components/page-structure/page/PageHeader";
import React, { Suspense } from "react";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import AnimalDesktopTable from "@/components/pages/animals/AnimalOverview/AnimalDesktopTable";
import MobileView from "@/components/page-structure/MobileView";
import AnimalMobileCard from "@/components/pages/animals/AnimalOverview/AnimalMobileCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useTranslations } from "next-intl";

export default function AnimalOverviewFilter() {
  const tCommon = useTranslations("common");

  const allAnimals = useAnimalStore((state) => state.allAnimals);
  const searchTerm = useAnimalStore((state) => state.searchTerm);
  const setSearchTerm = useAnimalStore((state) => state.setSearchTerm);
  const selectedBiome = useAnimalStore((state) => state.selectedBiome);
  const setSelectedBiome = useAnimalStore((state) => state.setSelectedBiome);
  const selectedShelterLevel = useAnimalStore((state) => state.selectedShelterLevel);
  const setSelectedShelterLevel = useAnimalStore((state) => state.setSelectedShelterLevel);
  const hasStatueFilter = useAnimalStore((state) => state.hasStatueFilter);
  const setHasStatueFilter = useAnimalStore((state) => state.setHasStatueFilter);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <BiomeSelect items={allAnimals} selectedBiome={selectedBiome} onChange={setSelectedBiome} />
      <ShelterLevelSelect
        items={allAnimals}
        selectedShelterLevel={selectedShelterLevel}
        onChange={(val) => setSelectedShelterLevel(val !== null ? String(val) : null)}
      />
      <FilterRow>
        <StatueCheckbox checked={hasStatueFilter} onChange={setHasStatueFilter} />
      </FilterRow>
    </FilterCard>
  );
}
