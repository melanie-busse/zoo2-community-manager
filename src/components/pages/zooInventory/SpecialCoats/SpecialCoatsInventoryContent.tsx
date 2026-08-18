"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatFilterBar from "@/components/elements/Filter/SpecialCoatFilterBar";
import SpecialCoatsInventoryFilterBar from "@/components/elements/Filter/SpecialCoatsInventoryFilterBar";
import SpecialCoatsMobileCard from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsMobileCard";
import MobileView from "@/components/page-structure/MobileView";
import SpecialCoatsPagination from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsPagination";
import SpecialCoatsInventoryDesktopTable from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryDesktopTable";

interface SpecialCoatsInventoryContentProps {
  userInventory: any[];
  regions: any[];
}

export default function SpecialCoatsInventoryContent({ userInventory, regions }: SpecialCoatsInventoryContentProps) {
  const t = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const currentItems = useSpecialCoatStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount: number = useSpecialCoatStore((state) => state.currentItems.length);
  const totalCount: number = useSpecialCoatStore((state) => state.filteredCount);

  return (
    <>
      <PageHeader text={t("overview_title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <SpecialCoatFilterBar />
        <SpecialCoatsInventoryFilterBar regions={regions} />
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <SpecialCoatsInventoryDesktopTable userInventory={userInventory} regions={regions} />

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
