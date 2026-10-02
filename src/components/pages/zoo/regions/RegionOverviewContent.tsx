"use client";

import React from "react";
import RegionDesktopTable from "./RegionDesktopTable";
import RegionMobileCard from "./RegionMobileCard";
import MobileView from "@/components/page-structure/MobileView";

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

interface RegionOverviewContentProps {
  regions: Region[];
}

export default function RegionOverviewContent({ regions }: RegionOverviewContentProps) {
  return (
    <>
      <RegionDesktopTable regions={regions} />
      <MobileView>
        {regions.map((region) => (
          <RegionMobileCard key={region.id} region={region} />
        ))}
      </MobileView>
    </>
  );
}
