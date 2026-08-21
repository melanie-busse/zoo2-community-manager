"use client";

import React, { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import MobileView from "@/components/page-structure/MobileView";
import SpecialCoatsPagination from "@/components/pages/specialCoats/SpecialCoatsOverview/SpecialCoatsPagination";
import SpecialCoatsInventoryDesktopTable from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryDesktopTable";
import SpecialCoatsInventoryFilter from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryFilter";
import SpecialCoatsInventoryMobileCard from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryMobileCard";

interface SpecialCoatsInventoryContentProps {
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

export default function SpecialCoatsInventoryContent({
  userInventory,
  regions,
}: SpecialCoatsInventoryContentProps) {
  const t = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const currentItems = useSpecialCoatStore((state) => state.currentItems);
  const hasItems = currentItems.length > 0;
  const currentCount: number = useSpecialCoatStore((state) => state.currentItems.length);
  const totalCount: number = useSpecialCoatStore((state) => state.filteredCount);

  const [inventoryState, setInventoryState] = useState<InventoryMap>(() =>
    (userInventory ?? []).reduce<InventoryMap>((acc, item) => {
      acc[item.specialCoatId] = {
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
    specialCoatId: number,
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
      const current = prev[specialCoatId] ?? defaults;
      return { ...prev, [specialCoatId]: { ...defaults, ...current, [field]: value } };
    });

    try {
      const response = await fetch("/api/zooInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialCoatId, field, value }),
      });
      if (!response.ok) {
        console.error("Fehler beim Speichern in der Datenbank");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Zoo-Inventars:", error);
    }
  };

  return (
    <>
      <PageHeader text={t("overview_title")} />

      <Suspense fallback={<div>{tCommon("loading")}</div>}>
        <SpecialCoatsInventoryFilter regions={regions} />
      </Suspense>

      <ResultsInfo currentCount={currentCount} totalCount={totalCount} />

      {hasItems ? (
        <>
          <SpecialCoatsInventoryDesktopTable
            inventoryState={inventoryState}
            regions={regions}
            onInventoryChange={handleChange}
          />

          <MobileView>
            {currentItems.map((specialCoat) => {
              const item = inventoryState[specialCoat.id];
              return (
                <SpecialCoatsInventoryMobileCard
                  key={specialCoat.id}
                  specialCoat={specialCoat}
                  inventoryCount={item?.count ?? 0}
                  inventoryLevel10={item?.level10 ?? false}
                  inventoryLevel20={item?.level20 ?? false}
                  inventoryGlitter={item?.glitterAnimal ?? false}
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
          title={t("emptyState.title")}
          message={tCommon("emptyState.message")}
        />
      )}

      <SpecialCoatsPagination />
    </>
  );
}