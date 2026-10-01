"use client";

import React from "react";
import ZooStatisticContent from "@/components/pages/zoo/statistik/ZooStatisticContent";
import { BiomeStatistic } from "@/types/zooStatistic";

interface ZooStatisticClientProps {
  biomeStatistics: BiomeStatistic[];
  totalCollections: number;
}

export default function ZooStatisticClient({ biomeStatistics, totalCollections }: ZooStatisticClientProps) {
  return <ZooStatisticContent biomeStatistics={biomeStatistics} totalCollections={totalCollections} />;
}
