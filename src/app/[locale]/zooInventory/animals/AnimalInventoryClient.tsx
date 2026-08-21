"use client";

import React from "react";
import { useAnimalStore } from "@/store/useAnimalStore";
import AnimalInventoryContent from "@/components/pages/zooInventory/Animals/AnimalInventoryContent";

interface AnimalInventoryClientProps {
  animals: any[];
  userInventory: any[];
  regions: any[];
}

export default function AnimalInventoryClient({
  animals,
  userInventory,
  regions,
}: AnimalInventoryClientProps) {
  const setInitialAnimals = useAnimalStore((state) => state.setInitialAnimals);

  const inventoryMap = new Map(userInventory.map((inv: any) => [inv.animalId, inv]));
  const animalsWithInventory = animals.map((animal: any) => ({
    ...animal,
    inventoryLevel10: inventoryMap.get(animal.id)?.level10 ?? false,
    inventoryLevel20: inventoryMap.get(animal.id)?.level20 ?? false,
    inventoryGlitter: inventoryMap.get(animal.id)?.glitterAnimal ?? false,
    inventoryRegionId: inventoryMap.get(animal.id)?.regionId ?? null,
  }));
  setInitialAnimals(animalsWithInventory);

  return <AnimalInventoryContent userInventory={userInventory} regions={regions} />;
}