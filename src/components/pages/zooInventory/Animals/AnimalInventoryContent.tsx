"use client";

import React, { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useAnimalStore } from "@/store/useAnimalStore";
import MobileView from "@/components/page-structure/MobileView";
import AnimalPagination from "@/components/pages/animals/AnimalOverview/AnimalPagination";
import AnimalInventoryDesktopTable from "@/components/pages/zooInventory/Animals/AnimalInventoryDesktopTable";
import AnimalInventoryFilter from "@/components/pages/zooInventory/Animals/AnimalInventoryFilter";
import AnimalInventoryMobileCard from "@/components/pages/zooInventory/Animals/AnimalInventoryMobileCard";

interface AnimalInventoryContentProps {
  userInventory: any[];
  regions: any[];
}

type InventoryMap = Record<
  number,
  {
    count: number;
    level10: boolean;
    level20: boolean;
    glitterAnimal: boolean;
    regionId: number | null;
  }
>;

export default function AnimalInventoryContent({
  userInventory,
  regions,
}: AnimalInventoryContentProps) {
  const t = useTranslations("animal");
  const tCommon = useTranslations("common");

  const currentItems = useAnimalStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount = useAnimalStore((state) => state.currentItems.length);
  const totalCount = useAnimalStore((state) => state.filteredCount);

  const [inventoryState, setInventoryState] = useState<InventoryMap>(() =>
    (userInventory ?? []).reduce<InventoryMap>((acc, item) => {
      acc[item.animalId] = {
        count: item.count ?? 0,
        level10: item.level10 ?? false,
        level20: item.level20 ?? false,
        glitterAnimal: item.glitterAnimal ?? false,
        regionId: item.regionId,
      };
      return acc;
    }, {}),
  );

  const handleChange = async (
    animalId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
    value: number | boolean | null,
  ) => {
    setInventoryState((prev) => {
      const defaults = {
        count: 0,
        level10: false,
        level20: false,
        glitterAnimal: false,
        regionId: null,
      };
      const current = prev[animalId] ?? defaults;
      return { ...prev, [animalId]: { ...defaults, ...current, [field]: value } };
    });

    try {
      const response = await fetch("/api/zooInventory/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId, field, value }),
      });
      if (!response.ok) {
        console.error("Fehler beim Speichern in der Datenbank");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Tier-Inventars:", error);
    }
  };

  return (
    <>
      <PageHeader text={t("inventory.title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <AnimalInventoryFilter regions={regions} />
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <AnimalInventoryDesktopTable
            inventoryState={inventoryState}
            regions={regions}
            onInventoryChange={handleChange}
          />

          <MobileView>
            {currentItems.map((animal) => {
              const item = inventoryState[animal.id];
              return (
                <AnimalInventoryMobileCard
                  key={animal.id}
                  animal={{
                    ...animal,
                    inventoryCount: item?.count ?? 0,
                    inventoryLevel10: item?.level10 ?? false,
                    inventoryLevel20: item?.level20 ?? false,
                    inventoryGlitter: item?.glitterAnimal ?? false,
                    inventoryRegionId: item?.regionId ?? null,
                  }}
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
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <AnimalPagination />
    </>
  );
}