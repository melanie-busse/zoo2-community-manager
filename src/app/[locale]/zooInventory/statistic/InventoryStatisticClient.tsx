"use client";

import React from "react";
import { InventoryBiomeStatistic } from "@/types/inventoryStatistic";
import InventoryStatisticContent from "@/components/pages/zooInventory/statistic/InventoryStatisticContent";

interface InventoryStatisticClientProps {
  biomeStatistics: InventoryBiomeStatistic[];
}

export default function InventoryStatisticClient({
  biomeStatistics,
}: InventoryStatisticClientProps) {
  return <InventoryStatisticContent biomeStatistics={biomeStatistics} />;
}