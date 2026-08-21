"use client";

import React, { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useStatueStore } from "@/store/useStatueStore";
import MobileView from "@/components/page-structure/MobileView";
import StatueInventoryFilter from "@/components/pages/zooInventory/Statues/StatueInventoryFilter";
import StatueInventoryDesktopTable from "@/components/pages/zooInventory/Statues/StatueInventoryDesktopTable";
import StatueInventoryMobileCard from "@/components/pages/zooInventory/Statues/StatueInventoryMobileCard";
import StatuePagination from "@/components/pages/zooInventory/Statues/StatuePagination";

interface StatueInventoryContentProps {
  userInventory: any[];
  regions: any[];
}

type StatueInventoryMap = Record<
  number,
  {
    puzzlePieces: number | null;
    regionId: number | null;
  }
>;

export default function StatueInventoryContent({
  userInventory,
  regions,
}: StatueInventoryContentProps) {
  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");

  const currentItems = useStatueStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount = useStatueStore((state) => state.currentItems.length);
  const totalCount = useStatueStore((state) => state.filteredCount);

  const [inventoryState, setInventoryState] = useState<StatueInventoryMap>(() =>
    (userInventory ?? []).reduce<StatueInventoryMap>((acc, item) => {
      acc[item.animalId] = {
        puzzlePieces: item.puzzlePieces ?? null,
        regionId: item.regionId ?? null,
      };
      return acc;
    }, {}),
  );

  const handleChange = async (
    animalId: number,
    field: "puzzlePieces" | "regionId",
    value: number | null,
  ) => {
    setInventoryState((prev) => {
      const current = prev[animalId] ?? { puzzlePieces: null, regionId: null };
      return { ...prev, [animalId]: { ...current, [field]: value } };
    });

    try {
      const response = await fetch("/api/zooInventory/statues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId, field, value }),
      });
      if (!response.ok) {
        console.error("Fehler beim Speichern in der Datenbank");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Statuen-Inventars:", error);
    }
  };

  return (
    <>
      <PageHeader text={tAnimal("statue.inventory_title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <StatueInventoryFilter regions={regions} />
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <StatueInventoryDesktopTable
            inventoryState={inventoryState}
            regions={regions}
            onInventoryChange={handleChange}
          />

          <MobileView>
            {currentItems.map((statue) => {
              const item = inventoryState[statue.id];
              return (
                <StatueInventoryMobileCard
                  key={statue.id}
                  statue={statue}
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
          object="animals"
          title={tAnimal("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <StatuePagination />
    </>
  );
}
