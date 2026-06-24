"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalMobileCard.styles";

import AnimalDesktopTable from "./AnimalDesktopTable";
import AnimalMobileCard from "./AnimalMobileCard";
import { useAnimalStore } from "@/store/useAnimalStore";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Pagination from "@/components/elements/Pagination/Pagination";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FilterBar from "@/components/elements/Filter/FilterBar";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";

export default function AnimalOverviewContent() {
  const t = useTranslations();

  const currentItems = useAnimalStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;

  return (
    <>
      <PageHeader text={t("Animals.overview_title")} />

      <Suspense fallback={<div>Lade Filter...</div>}>
        <FilterBar />
      </Suspense>

      <ResultsInfo />

      {hasItems ? (
        <>
          <AnimalDesktopTable />

          <Styles.StyledMobileView>
            {currentItems.map((animal) => (
              <AnimalMobileCard key={animal.id} animal={animal} />
            ))}
          </Styles.StyledMobileView>
        </>
      ) : (
        <EmptyState object="animals" />
      )}

      <Pagination />
    </>
  );
}
