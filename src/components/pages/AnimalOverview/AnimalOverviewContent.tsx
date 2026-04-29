"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import AnimalDesktopTable from "./AnimalDesktopTable";
import AnimalMobileCard from "./AnimalMobileCard";
import { Animal } from "@/types/animal";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Pagination from "@/components/elements/Pagination/Pagination";
import MobileListView from "@/components/elements/MobileListView/MobileListView";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FilterBar from "@/components/elements/Filter/FilterBar";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";

interface AnimalOverviewContentProps {
  animals: Animal[];
  currentItems: Animal[];
  filteredCount: number;
  sortBy: string | null;
  sortDirection: "asc" | "desc";
  toggleSort: (key: string) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleAnimalClick: (id: number) => void;
  handleResetFilters: () => void;
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export default function AnimalOverviewContent({
  animals,
  currentItems,
  filteredCount,
  sortBy,
  sortDirection,
  toggleSort,
  handleEdit,
  handleDelete,
  handleAnimalClick,
  handleResetFilters,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
}: AnimalOverviewContentProps) {
  const t = useTranslations();

  return (
    <>
      <PageHeader text={t("Animals.overview_title")} />

      {/* Suspense ist wichtig, da useSearchParams() den Client-Render erzwingt */}
      <Suspense fallback={<div>Lade Filter...</div>}>
        <FilterBar animals={animals} />
      </Suspense>

      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} />

      {currentItems.length > 0 ? (
        <>
          <AnimalDesktopTable
            animals={currentItems}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={toggleSort}
            onEdit={handleEdit.toString}
            onDelete={handleDelete.toString}
          />

          <MobileListView
            currentItems={currentItems}
            onItemClick={handleAnimalClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderCardAction={(animal, handlers) => (
              <AnimalMobileCard
                animal={animal}
                onClickAction={() => handlers.onItemClick?.(animal.id)}
                onEditAction={() => handlers.onEdit?.(animal.id)}
                onDeleteAction={() => handlers.onDelete?.(animal.id)}
              />
            )}
          />
        </>
      ) : (
        <EmptyState object="animals" onResetAction={handleResetFilters} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />
      )}
    </>
  );
}
