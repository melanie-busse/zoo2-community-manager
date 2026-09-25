"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";

import { SpecialCoat } from "@/types/specialCoat";
import SpecialCoatCard from "./SpecialCoatCard";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function SpecialCoatArea() {
  const tAnimals = useTranslations("animal");

  const animal = useAnimalStore((state) => state.selectedAnimal);
  const coats = animal?.specialcoat;

  if (!coats || coats.length === 0) {
    return null;
  }

  return (
    <>
      <Styles.SectionHeadline>
        <span style={{ fontSize: "1.2rem" }}>🌸</span>
        {tAnimals("colorVariants")}
      </Styles.SectionHeadline>

      <Styles.SpecialCoatGrid>
        {coats.map((coat: SpecialCoat) => {
          const biome = animal?.biome?.identifier;
          const animalId = animal?.identifier;
          const coatFolder = coat.identifier && animalId ? coat.identifier.slice(animalId.length + 1) : "";
          const imagePath =
            biome && animalId && coatFolder
              ? `/images/animals/${biome}/${animalId}/specialcoats/${coatFolder}/image.jpg`
              : "/images/placeholder.jpg";
          return <SpecialCoatCard key={coat.id} specialCoat={coat} imagePath={imagePath} />;
        })}
      </Styles.SpecialCoatGrid>
    </>
  );
}
