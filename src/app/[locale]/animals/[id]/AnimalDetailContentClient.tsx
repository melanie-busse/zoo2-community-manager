"use client";

import React, { useRef } from "react";

import { Animal } from "@/types/animal";
import AnimalDetailContent from "@/components/pages/animals/AnimalDetails/AnimalDetailContent";
import { useAnimalStore } from "@/store/useAnimalStore";

interface AnimalDetailContentClientProps {
  animal: Animal;
}

export default function AnimalDetailContentClient({ animal }: AnimalDetailContentClientProps) {
  const initializedAnimalId = useRef<number | null>(null);

  if (initializedAnimalId.current !== animal.id) {
    useAnimalStore.setState({ selectedAnimal: animal });
    initializedAnimalId.current = animal.id;
  }

  return <AnimalDetailContent />;
}
