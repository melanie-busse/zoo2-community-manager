"use client";

import React, { useEffect } from "react";
import AnimalOverviewContent from "@/components/pages/animals/AnimalOverview/AnimalOverviewContent";
import { useAnimalStore } from "@/store/useAnimalStore";

interface AnimalOverviewClientProps {
  initialAnimals: any[];
}

export default function AnimalOverviewClient({ initialAnimals }: AnimalOverviewClientProps) {
  const setInitialAnimals = useAnimalStore((state) => state.setInitialAnimals);

  useEffect(() => {
    if (initialAnimals) {
      setInitialAnimals(initialAnimals);
    }
  }, [initialAnimals, setInitialAnimals]);

  return <AnimalOverviewContent />;
}
