"use client";

import React from "react";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import SpecialCoatsInventoryContent from "@/components/pages/zooInventory/SpecialCoats/SpecialCoatsInventoryContent";

interface SpecialCoatsCollectionClientProps {
  specialCoats: any[];
  userInventory: any[];
}

export default function SpecialCoatsInventoryClient({
  specialCoats,
  userInventory,
}: SpecialCoatsCollectionClientProps) {
  const setInitialSpecialCoats = useSpecialCoatStore((state) => state.setInitialSpecialCoats);
  setInitialSpecialCoats(specialCoats);

  return <SpecialCoatsInventoryContent userInventory={userInventory} />;
}
