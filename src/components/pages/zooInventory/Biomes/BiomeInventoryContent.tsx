"use client";

import React, { useState } from "react";
import styled from "styled-components";

import { BiomeInventoryField, BiomeInventoryData } from "@/service/BiomeInventoryService";
import {
  updateBiomeInventoryOnClient,
  updateBiomeGameInventoryOnClient,
} from "@/service/frontend/BiomeInventory";
import BiomeInventoryCard from "./BiomeInventoryCard";

interface Game {
  id: number;
  texts: { name: string }[];
  identifier: string;
}

interface Biome {
  id: number;
  identifier: string;
  biomestext: { biomeName: string }[];
  games: Game[];
}

interface BiomeInventoryContentProps {
  data: { biome: Biome; inventory: BiomeInventoryData | null; gameInventory: Map<number, number> }[];
}

export default function BiomeInventoryContent({ data }: BiomeInventoryContentProps) {
  const [inventoryMap, setInventoryMap] = useState<Map<number, BiomeInventoryData>>(() => {
    const map = new Map<number, BiomeInventoryData>();
    data.forEach(({ biome, inventory }) => {
      if (inventory) {
        map.set(biome.id, inventory);
      }
    });
    return map;
  });

  const [gameInventoryMap, setGameInventoryMap] = useState<Map<number, number>>(() => {
    const map = new Map<number, number>();
    data.forEach(({ gameInventory }) => {
      gameInventory.forEach((count, gameId) => {
        map.set(gameId, count);
      });
    });
    return map;
  });

  function handleFieldChange(biomeId: number, field: BiomeInventoryField, value: boolean | number) {
    setInventoryMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(biomeId) ?? {
        enclosure: false,
        trough: false,
        waterHole: false,
        shelterLevel0: 0,
        shelterLevel1: 0,
        shelterLevel2: 0,
        shelterLevel3: 0,
      };
      next.set(biomeId, { ...existing, [field]: value });
      return next;
    });

    updateBiomeInventoryOnClient(biomeId, field, value).catch((err) => {
      console.error("[BiomeInventoryContent] Failed to save biome field:", err);
    });
  }

  function handleGameChange(biomeGameId: number, count: number) {
    setGameInventoryMap((prev) => {
      const next = new Map(prev);
      next.set(biomeGameId, count);
      return next;
    });

    updateBiomeGameInventoryOnClient(biomeGameId, count).catch((err) => {
      console.error("[BiomeInventoryContent] Failed to save game count:", err);
    });
  }

  return (
    <Grid>
      {data.map(({ biome }) => (
        <BiomeInventoryCard
          key={biome.id}
          biome={biome}
          inventory={inventoryMap.get(biome.id) ?? null}
          gameInventory={gameInventoryMap}
          onFieldChange={handleFieldChange}
          onGameChange={handleGameChange}
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
