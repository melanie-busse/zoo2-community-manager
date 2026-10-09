"use client";

import React from "react";
import ZooStatisticContent from "@/components/pages/zoo/statistik/ZooStatisticContent";
import { BiomeStatistic } from "@/types/zooStatistic";

interface ZooStatisticClientProps {
  biomeStatistics: BiomeStatistic[];
  totalCollections: number;
  regionStatistics: { totalRegions: number; totalBreedingSlots: number; totalBiomes: number; totalTerrains: number };
}

export default function ZooStatisticClient({ biomeStatistics, totalCollections, regionStatistics }: ZooStatisticClientProps) {
  return <ZooStatisticContent biomeStatistics={biomeStatistics} totalCollections={totalCollections} regionStatistics={regionStatistics} />;
}
