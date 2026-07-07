"use client";

import React, { useEffect } from "react";

import { Animal } from "@/types/animal";
import AnimalDetailContent from "@/components/pages/animals/AnimalDetails/AnimalDetailContent";
import { useAnimalStore } from "@/store/useAnimalStore";

interface AnimalDetailContentClientProps {
  animal: Animal;
}

export default function AnimalDetailContentClient({ animal }: AnimalDetailContentClientProps) {
  useEffect(() => {
    useAnimalStore.setState({ selectedAnimal: animal });
  }, [animal]);

  return <AnimalDetailContent />;
}
