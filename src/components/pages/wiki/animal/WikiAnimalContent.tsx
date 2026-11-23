"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import AnimalPackageTrades from "@/components/pages/wiki/animal/AnimalPackageTrades";
import AnimalBreedingContent from "@/components/pages/wiki/animal/AnimalBreedingContent";
import AnimalSuperDeal from "@/components/pages/wiki/animal/AnimalSuperDeal";
import AnimalSparkling from "@/components/pages/wiki/animal/AnimalSparkling";
import AnimalPetting from "@/components/pages/wiki/animal/AnimalPetting";
import AnimalIceCreamVendor from "@/components/pages/wiki/animal/AnimalIceCreamVendor";

export default function WikiAnimalContent() {
  const t = useTranslations("wiki_animal");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <AnimalBreedingContent />
      <AnimalPetting />
      <AnimalSparkling />
      <AnimalPackageTrades />
      <AnimalSuperDeal />
      <AnimalIceCreamVendor />
    </>
  );
}
