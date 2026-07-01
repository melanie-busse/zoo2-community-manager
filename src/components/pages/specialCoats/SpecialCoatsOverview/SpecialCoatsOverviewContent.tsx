"use client";

import React, { Suspense, useEffect } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatFilterBar from "@/components/elements/Filter/SpecialCoatFilterBar";
import SpecialCodesDesktopTable from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsDesktopTable";
import SpecialCoatsMobileCard from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsMobileCard";
import MobileView from "@/components/page-structure/MobileView";
import SpecialCoatsPagination from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsPagination";

export default function SpecialCoatsOverviewContent() {
  const t = useTranslations();

  const currentItems = useSpecialCoatStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  useEffect(() => {
    console.log("Current Items haben sich geändert:", currentItems);
  }, [currentItems]);

  const currentCount: number = useSpecialCoatStore((state) => state.currentItems.length);
  const totalCount: number = useSpecialCoatStore((state) => state.filteredCount);

  return (
    <>
      <PageHeader text={t("SpecialCoat.overview_title")} />

      <Suspense fallback={<div>Lade Filter...</div>}>
        <SpecialCoatFilterBar />
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
        <EmptyState object="specialCoats" message="Keine speziellen Farbvarianten vorhanden." />
      )}

      <SpecialCoatsPagination />
    </>
  );
}
