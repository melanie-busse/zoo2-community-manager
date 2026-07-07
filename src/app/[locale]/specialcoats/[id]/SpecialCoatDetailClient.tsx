"use client";

import React, { useEffect } from "react";

import { SpecialCoat } from "@/types/specialCoat";
import { Animal } from "@/types/animal";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { useAnimalStore } from "@/store/useAnimalStore";
import SpecialCoatDetailContent from "@/components/pages/specialCoats/SpecialCoatDetails/SpecialCoatDetailContent";

interface SpecialCoatDetailClientProps {
  specialCoat: SpecialCoat;
  animal: Animal;
}

export default function SpecialCoatDetailClient({
  specialCoat,
  animal,
}: SpecialCoatDetailClientProps) {
  useEffect(() => {
    useSpecialCoatStore.setState({ selectedSpecialCoat: specialCoat });
    useAnimalStore.setState({ selectedAnimal: animal });
  }, [specialCoat, animal]);

  return <SpecialCoatDetailContent />;
}