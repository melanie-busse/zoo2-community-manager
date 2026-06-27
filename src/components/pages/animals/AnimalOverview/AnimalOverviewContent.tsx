"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import AnimalDesktopTable from "./AnimalDesktopTable";
import AnimalMobileCard from "./AnimalMobileCard";
import { useAnimalStore } from "@/store/useAnimalStore";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FilterBar from "@/components/elements/Filter/FilterBar";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import MobileView from "@/components/page-structure/MobileView";
import AnimalPagination from "@/components/pages/animals/AnimalOverview/AnimalPagination";

export default function AnimalOverviewContent() {
  const t = useTranslations();

  const currentItems = useAnimalStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount = useAnimalStore((state) => state.currentItems.length);
  const totalCount = useAnimalStore((state) => state.filteredCount);

  return (
    <>
      <PageHeader text={t("Animals.overview_title")} />

      <Suspense fallback={<div>Lade Filter...</div>}>
        <FilterBar />
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
        <EmptyState object="animals" />
      )}

      <AnimalPagination />
    </>
  );
}
