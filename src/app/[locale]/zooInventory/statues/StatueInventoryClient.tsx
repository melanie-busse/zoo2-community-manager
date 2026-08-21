"use client";

import React from "react";
import { useStatueStore } from "@/store/useStatueStore";
import StatueInventoryContent from "@/components/pages/zooInventory/Statues/StatueInventoryContent";

interface StatueInventoryClientProps {
  statues: any[];
  userInventory: any[];
  regions: any[];
}

export default function StatueInventoryClient({
  statues,
  userInventory,
  regions,
}: StatueInventoryClientProps) {
  const setInitialStatues = useStatueStore((state) => state.setInitialStatues);

  const inventoryMap = new Map(userInventory.map((inv: any) => [inv.animalId, inv]));
  const statuesWithInventory = statues.map((statue: any) => ({
    ...statue,
    inventoryRegionId: inventoryMap.get(statue.id)?.regionId ?? null,
  }));
  setInitialStatues(statuesWithInventory);

  return <StatueInventoryContent userInventory={userInventory} regions={regions} />;
}
