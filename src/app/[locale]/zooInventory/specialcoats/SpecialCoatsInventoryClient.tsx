"use client";

import React from "react";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatsInventoryContent from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryContent";

interface SpecialCoatsCollectionClientProps {
  specialCoats: any[];
  userInventory: any[];
  regions: any[];
}

export default function SpecialCoatsInventoryClient({
  specialCoats,
  userInventory,
  regions,
}: SpecialCoatsCollectionClientProps) {
  const setInitialSpecialCoats = useSpecialCoatStore((state) => state.setInitialSpecialCoats);

  const inventoryMap = new Map(userInventory.map((inv: any) => [inv.specialCoatId, inv]));
  const coatsWithInventory = specialCoats.map((coat: any) => ({
    ...coat,
    ownedAmount: inventoryMap.get(coat.id)?.count ?? 0,
  }));
  setInitialSpecialCoats(coatsWithInventory);

  return <SpecialCoatsInventoryContent userInventory={userInventory} regions={regions} />;
}
