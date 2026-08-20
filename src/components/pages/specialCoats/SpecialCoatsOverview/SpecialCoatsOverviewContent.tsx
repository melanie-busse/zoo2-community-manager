"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCodesDesktopTable from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsDesktopTable";
import SpecialCoatsMobileCard from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsMobileCard";
import MobileView from "@/components/page-structure/MobileView";
import SpecialCoatsPagination from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsPagination";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { ContestOnlyCheckbox } from "@/components/elements/Filter/ContestOnlyCheckbox";

export default function SpecialCoatsOverviewContent() {
  const t = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const currentItems = useSpecialCoatStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount: number = useSpecialCoatStore((state) => state.currentItems.length);
  const totalCount: number = useSpecialCoatStore((state) => state.filteredCount);

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
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <SpecialCodesDesktopTable />

          <MobileView>
            {currentItems.map((specialCoat) => (
              <SpecialCoatsMobileCard key={specialCoat.id} specialCoat={specialCoat} />
            ))}
          </MobileView>
        </>
      ) : (
        <EmptyState
          object="specialCoats"
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <SpecialCoatsPagination />
    </>
  );
}
