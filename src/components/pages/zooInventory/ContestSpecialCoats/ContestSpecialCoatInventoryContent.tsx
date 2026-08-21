"use client";

import React, { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useContestSpecialCoatStore } from "@/store/useContestSpecialCoatStore";
import MobileView from "@/components/page-structure/MobileView";
import ContestSpecialCoatInventoryFilter from "@/components/pages/zooInventory/ContestSpecialCoats/ContestSpecialCoatInventoryFilter";
import ContestSpecialCoatInventoryDesktopTable from "@/components/pages/zooInventory/ContestSpecialCoats/ContestSpecialCoatInventoryDesktopTable";
import ContestSpecialCoatInventoryMobileCard from "@/components/pages/zooInventory/ContestSpecialCoats/ContestSpecialCoatInventoryMobileCard";
import ContestSpecialCoatPagination from "@/components/pages/zooInventory/ContestSpecialCoats/ContestSpecialCoatPagination";

interface ContestSpecialCoatInventoryContentProps {
  userInventory: any[];
  regions: any[];
}

type ContestCoatInventoryMap = Record<
  number,
  {
    puzzlePieces: number | null;
    regionId: number | null;
  }
>;

export default function ContestSpecialCoatInventoryContent({
  userInventory,
  regions,
}: ContestSpecialCoatInventoryContentProps) {
  const tSpecialCoat = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const currentItems = useContestSpecialCoatStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount = useContestSpecialCoatStore((state) => state.currentItems.length);
  const totalCount = useContestSpecialCoatStore((state) => state.filteredCount);

  const [inventoryState, setInventoryState] = useState<ContestCoatInventoryMap>(() =>
    (userInventory ?? []).reduce<ContestCoatInventoryMap>((acc, item) => {
      acc[item.specialCoatId] = {
        puzzlePieces: item.puzzlePieces ?? null,
        regionId: item.regionId ?? null,
      };
      return acc;
    }, {}),
  );

  const handleChange = async (
    specialCoatId: number,
    field: "puzzlePieces" | "regionId",
    value: number | null,
  ) => {
    setInventoryState((prev) => {
      const current = prev[specialCoatId] ?? { puzzlePieces: null, regionId: null };
      return { ...prev, [specialCoatId]: { ...current, [field]: value } };
    });

    try {
      const response = await fetch("/api/zooInventory/contestSpecialCoats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialCoatId, field, value }),
      });
      if (!response.ok) {
        console.error("Fehler beim Speichern in der Datenbank");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Wettbewerbs-Farbvarianten-Inventars:", error);
    }
  };

  return (
    <>
      <PageHeader text={tSpecialCoat("contest_inventory_title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <ContestSpecialCoatInventoryFilter regions={regions} />
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <ContestSpecialCoatInventoryDesktopTable
            inventoryState={inventoryState}
            regions={regions}
            onInventoryChange={handleChange}
          />

          <MobileView>
            {currentItems.map((coat) => {
              const item = inventoryState[coat.id];
              return (
                <ContestSpecialCoatInventoryMobileCard
                  key={coat.id}
                  coat={coat}
                  inventoryPuzzlePieces={item?.puzzlePieces ?? null}
                  inventoryRegionId={item?.regionId ?? null}
                  regions={regions}
                  onInventoryChange={handleChange}
                />
              );
            })}
          </MobileView>
        </>
      ) : (
        <EmptyState
          object="specialCoats"
          title={tSpecialCoat("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <ContestSpecialCoatPagination />
    </>
  );
}
