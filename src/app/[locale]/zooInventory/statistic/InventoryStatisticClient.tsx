"use client";

import React from "react";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";
import InventoryStatisticContent from "@/components/pages/zooInventory/statistic/InventoryStatisticContent";

interface InventoryStatisticClientProps {
  biomeStatistics: InventoryBiomeStatistic[];
  collectionStats: { total: number; completed: number };
}

export default function InventoryStatisticClient({
  biomeStatistics,
  collectionStats,
}: InventoryStatisticClientProps) {
  return <InventoryStatisticContent biomeStatistics={biomeStatistics} collectionStats={collectionStats} />;
}