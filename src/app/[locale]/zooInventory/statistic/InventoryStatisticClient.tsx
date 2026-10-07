"use client";

import React from "react";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";
import InventoryStatisticContent from "@/components/pages/zooInventory/statistic/InventoryStatisticContent";

interface InventoryStatisticClientProps {
  biomeStatistics: InventoryBiomeStatistic[];
  collectionStats: { total: number; completed: number };
  regionStatistics: { ownedRegions: number; ownedBreedingSlots: number; totalRegions: number; totalBreedingSlots: number };
}

export default function InventoryStatisticClient({
  biomeStatistics,
  collectionStats,
  regionStatistics,
}: InventoryStatisticClientProps) {
  return <InventoryStatisticContent biomeStatistics={biomeStatistics} collectionStats={collectionStats} regionStatistics={regionStatistics} />;
}