"use client";

import React from "react";
import Image from "next/image";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import { Animal } from "@/types/animal";

interface BiomeGame {
  identifier: string;
  biomeIdentifier: string;
  texts: { name: string }[];
}

interface BiomeGameSelectProps {
  animals: Animal[];
  selectedBiome: string | null;
  selectedBiomeGame: string | null;
  onChange: (value: string | null) => void;
}

function extractUniqueGames(animals: Animal[], selectedBiome: string | null): BiomeGame[] {
  const seen = new Set<string>();
  const games: BiomeGame[] = [];

  for (const animal of animals) {
    if (!animal.biomeGame) continue;
    if (selectedBiome !== null) {
      const biomeName = animal.biome?.biomestext?.[0]?.biomeName ?? animal.biome?.identifier ?? "";
      if (biomeName !== selectedBiome) continue;
    }
    const { identifier } = animal.biomeGame;
    if (!seen.has(identifier)) {
      seen.add(identifier);
      games.push(animal.biomeGame as BiomeGame);
    }
  }

  return games.sort((a, b) => {
    const nameA = a.texts[0]?.name ?? a.identifier;
    const nameB = b.texts[0]?.name ?? b.identifier;
    return nameA.localeCompare(nameB);
  });
}

export function BiomeGameSelect({
  animals,
  selectedBiome,
  selectedBiomeGame,
  onChange,
}: BiomeGameSelectProps) {
  const games = extractUniqueGames(animals, selectedBiome);

  if (games.length === 0) return null;

  return (
    <SelectBoxWithImage<BiomeGame>
      items={games}
      selectedValue={selectedBiomeGame ?? "all"}
      onSelectAction={(val) => onChange(val === "all" ? null : val)}
      allLabelKey="all_games"
      getIdentifier={(game) => game.identifier}
      getLabel={(game) => game.texts[0]?.name ?? game.identifier}
      renderBadge={(game) => (
        <Image
          src={`/images/biomes/${game.biomeIdentifier}/game/${game.identifier}/image.jpg`}
          alt={game.texts[0]?.name ?? game.identifier}
          width={24}
          height={24}
          style={{ objectFit: "cover", borderRadius: 3 }}
        />
      )}
    />
  );
}
