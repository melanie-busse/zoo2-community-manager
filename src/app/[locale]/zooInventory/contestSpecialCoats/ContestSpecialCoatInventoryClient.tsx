"use client";

import React from "react";
import { useContestSpecialCoatStore } from "@/store/useContestSpecialCoatStore";
import ContestSpecialCoatInventoryContent from "@/components/pages/zooInventory/ContestSpecialCoats/ContestSpecialCoatInventoryContent";

interface ContestSpecialCoatInventoryClientProps {
  coats: any[];
  userInventory: any[];
  regions: any[];
}

export default function ContestSpecialCoatInventoryClient({
  coats,
  userInventory,
  regions,
}: ContestSpecialCoatInventoryClientProps) {
  const setInitialCoats = useContestSpecialCoatStore((state) => state.setInitialCoats);

  const inventoryMap = new Map(userInventory.map((inv: any) => [inv.specialCoatId, inv]));
  const coatsWithInventory = coats.map((coat: any) => ({
    ...coat,
    inventoryRegionId: inventoryMap.get(coat.id)?.regionId ?? null,
  }));
  setInitialCoats(coatsWithInventory);

  return <ContestSpecialCoatInventoryContent userInventory={userInventory} regions={regions} />;
}
