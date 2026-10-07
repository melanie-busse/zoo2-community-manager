"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { RegionInventoryField, RegionInventoryData } from "@/service/RegionInventoryService";
import { updateRegionInventoryOnClient } from "@/service/frontend/RegionInventory";
import RegionInventoryCard from "./RegionInventoryCard";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
  breedingCenterSlots: { slot: number }[];
  admissionsBooths: { booth_level: number }[];
  guestLounges: { id: number }[];
  desingBoutique: { id: number }[];
  clubHouse: { id: number }[];
}

interface RegionInventoryContentProps {
  data: { region: Region; inventory: RegionInventoryData | null }[];
}

export default function RegionInventoryContent({ data }: RegionInventoryContentProps) {
  const [inventoryMap, setInventoryMap] = useState<Map<number, RegionInventoryData>>(() => {
    const map = new Map<number, RegionInventoryData>();
    data.forEach(({ region, inventory }) => {
      if (inventory) {
        map.set(region.id, inventory);
      }
    });
    return map;
  });

  function handleChange(regionId: number, field: RegionInventoryField, value: boolean | number | null) {
    setInventoryMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(regionId) ?? {
        owned: false,
        breedingCenterSlots: null,
        admissionsBoothLevel: null,
        adminBuilding: false,
        visitorCenter: false,
        transportStation: false,
        guestLounge: false,
        desingBoutique: false,
        clubHouse: false,
      };
      next.set(regionId, { ...existing, [field]: value });
      return next;
    });

    // Fire-and-forget: optimistic update already applied; UI shows stale data on API failure (accepted behaviour)
    updateRegionInventoryOnClient(regionId, field, value).catch((err) => {
      console.error("[RegionInventoryContent] Failed to save:", err);
    });
  }

  return (
    <Grid>
      {data.map(({ region }) => (
        <RegionInventoryCard
          key={region.id}
          region={region}
          inventory={inventoryMap.get(region.id) ?? null}
          onFieldChange={handleChange}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
