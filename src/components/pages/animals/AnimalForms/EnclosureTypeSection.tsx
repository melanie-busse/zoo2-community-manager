"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import Selectbox from "@/components/ui/form/Selectbox";
import { Biome } from "@/types/biome";

interface EnclosureTypeSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  biomes: Biome[];
}

export default function EnclosureTypeSection({
  formData,
  setFormData,
  biomes = [],
}: EnclosureTypeSectionProps) {
  const tBiome = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  const biomeOptions = Array.isArray(biomes)
    ? biomes.map((b) => ({
        value: b.id.toString(),
        label: b.biomestext?.[0]?.biomeName || `Biom #${b.id}`,
      }))
    : [];

  const handleBiomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      biomeId: val ? parseInt(val, 10) : null,
    }));
  };

  return (
    <InfoAccordion
      title={tBiome("enclosure")}
      icon="/images/biomes/grassland/enclosure.webp"
      defaultOpen={true}
    >
      <Styles.SectionColumn>
        <Styles.Label htmlFor="biomeId">{tBiome("enclosureType")}</Styles.Label>
        <Selectbox
          id="biomeId"
          name="biomeId"
          value={formData?.biomeId?.toString() ?? ""}
          onChange={handleBiomeChange}
          options={biomeOptions}
          $width="100%"
          placeholder={tCommon("pleaseSelect")}
        />
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
