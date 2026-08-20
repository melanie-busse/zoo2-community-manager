"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import AnimalDesktopTable from "./AnimalDesktopTable";
import AnimalMobileCard from "./AnimalMobileCard";
import { useAnimalStore } from "@/store/useAnimalStore";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import MobileView from "@/components/page-structure/MobileView";
import AnimalPagination from "@/components/pages/animals/AnimalOverview/AnimalPagination";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { StatueCheckbox } from "@/components/elements/Filter/StatueCheckbox";

export default function AnimalOverviewContent() {
  const t = useTranslations("animal");
  const tCommon = useTranslations("common");

  const currentItems = useAnimalStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount = useAnimalStore((state) => state.currentItems.length);
  const totalCount = useAnimalStore((state) => state.filteredCount);

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
    <>
      <PageHeader text={t("overview_title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <FilterCard>
          <SearchInputField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={tCommon("filter.search_placeholder")}
          />
          <BiomeSelect
            items={allAnimals}
            selectedBiome={selectedBiome}
            onChange={setSelectedBiome}
          />
          <ShelterLevelSelect
            items={allAnimals}
            selectedShelterLevel={selectedShelterLevel}
            onChange={(val) => setSelectedShelterLevel(val !== null ? String(val) : null)}
          />
          <FilterRow>
            <StatueCheckbox checked={hasStatueFilter} onChange={setHasStatueFilter} />
          </FilterRow>
        </FilterCard>
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <AnimalDesktopTable />

          <MobileView>
            {currentItems.map((animal) => (
              <AnimalMobileCard key={animal.id} animal={animal} />
            ))}
          </MobileView>
        </>
      ) : (
        <EmptyState
          object="animals"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <AnimalPagination />
    </>
  );
}
