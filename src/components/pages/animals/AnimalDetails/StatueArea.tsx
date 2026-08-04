"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalDetails.styles";
import StatueCard from "./StatueCard";
import { useAnimalStore } from "@/store/useAnimalStore";

export default function StatueArea() {
  const tAnimal = useTranslations("animal");
  const animal = useAnimalStore((state) => state.selectedAnimal);

  if (!animal?.isContestAnimal || !animal.statueImage) {
    return null;
  }

  return (
    <>
      <Styles.SectionHeadline>
        <span style={{ fontSize: "1.2rem" }}>🗿</span>
        {tAnimal("statue")}
      </Styles.SectionHeadline>

      <Styles.SpecialCoatGrid>
        <StatueCard statueImage={animal.statueImage} />
      </Styles.SpecialCoatGrid>
    </>
  );
}