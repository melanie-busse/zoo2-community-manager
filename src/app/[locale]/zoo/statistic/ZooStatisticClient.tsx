"use client";

import React from "react";
import ZooStatisticContent from "@/components/pages/zoo/statistik/ZooStatisticContent";
import { BiomeStatistic } from "@/types/zooStatistic";

interface ZooStatisticClientProps {
  biomeStatistics: BiomeStatistic[];
}

export default function ZooStatisticClient({ biomeStatistics }: ZooStatisticClientProps) {
  return <ZooStatisticContent biomeStatistics={biomeStatistics} />;
}
