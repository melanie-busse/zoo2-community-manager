"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";
import StatueCard from "./StatueCard";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function StatueArea() {
  const tAnimal = useTranslations("animal");
  const animal = useAnimalStore((state) => state.selectedAnimal);

  const biome = animal?.biome?.identifier;
  const animalId = animal?.identifier;

  if (!animal?.isContestAnimal || !biome || !animalId) {
    return null;
  }

  const imagePath = `/images/animals/${biome}/${animalId}/statue/image.webp`;

  return (
    <>
      <Styles.SectionHeadline>
        <span style={{ fontSize: "1.2rem" }}>🗿</span>
        {tAnimal("statue.title")}
      </Styles.SectionHeadline>

      <Styles.SpecialCoatGrid>
        <StatueCard imagePath={imagePath} />
      </Styles.SpecialCoatGrid>
    </>
  );
}