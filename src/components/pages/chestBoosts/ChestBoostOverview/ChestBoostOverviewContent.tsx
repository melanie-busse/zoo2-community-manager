"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useChestBoostStore } from "@/store/useChestBoostStore";
import { getYearsFromBoosts } from "@/utils/ChestBoostUtil";
import ChestBoostOverviewFilter from "./ChestBoostOverviewFilter";
import ChestBoostDesktopTable from "./ChestBoostDesktopTable";
import ChestBoostMobileCard from "./ChestBoostMobileCard";
import MobileView from "@/components/page-structure/MobileView";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import Pagination from "@/components/elements/Pagination/Pagination";

export default function ChestBoostOverviewContent() {
  const t = useTranslations("chestBoosts");
  const tCommon = useTranslations("common");

  const allBoosts = useChestBoostStore((state) => state.allBoosts);
  const currentItems = useChestBoostStore((state) => state.currentItems);
  const filteredCount = useChestBoostStore((state) => state.filteredCount);
  const currentPage = useChestBoostStore((state) => state.currentPage);
  const itemsPerPage = useChestBoostStore((state) => state.itemsPerPage);
  const nextPage = useChestBoostStore((state) => state.nextPage);
  const prevPage = useChestBoostStore((state) => state.prevPage);
  const deleteBoost = useChestBoostStore((state) => state.deleteBoost);

  const years = getYearsFromBoosts(allBoosts);

  const handleDelete = (id: number) => {
    deleteBoost(id, t, tCommon);
  };

  return (
    <>
      <ChestBoostOverviewFilter years={years} />

      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} />

      {currentItems.length > 0 ? (
        <>
          <ChestBoostDesktopTable items={currentItems} onDelete={handleDelete} />

          <MobileView>
            {currentItems.map((boost) => (
              <ChestBoostMobileCard key={boost.id} boost={boost} onDelete={handleDelete} />
            ))}
          </MobileView>
        </>
      ) : (
        <EmptyState
          object="chest-boosts"
          title={t("no_results")}
          message={tCommon("emptyState.message")}
        />
      )}

      <Pagination
        currentPage={currentPage}
        filteredCount={filteredCount}
        itemsPerPage={itemsPerPage}
        onNext={() => nextPage()}
        onPrev={() => prevPage()}
      />
    </>
  );
}
