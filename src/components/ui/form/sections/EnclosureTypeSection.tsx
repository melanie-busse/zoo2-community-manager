"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import Selectbox from "@/components/ui/form/Selectbox";
import { Biome } from "@/types/biome";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import Label from "@/components/ui/form/Label";

interface BiomeGameWithBiomes {
  id: number;
  identifier: string;
  texts: { name: string }[];
  biomes: { id: number }[];
}

interface EnclosureTypeSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  biomes: Biome[];
  biomeGames: BiomeGameWithBiomes[];
}

export default function EnclosureTypeSection({
  formData,
  setFormData,
  biomes = [],
  biomeGames = [],
}: EnclosureTypeSectionProps) {
  const tBiome = useTranslations("biome");
  const tCommon = useTranslations("common");

  const biomeOptions = Array.isArray(biomes)
    ? biomes.map((b) => ({
        value: b.id.toString(),
        label: b.biomestext?.[0]?.biomeName || `Biom #${b.id}`,
      }))
    : [];

  const selectedBiomeId = formData?.biomeId ? parseInt(formData.biomeId, 10) : null;

  const filteredGameOptions = selectedBiomeId
    ? biomeGames
        .filter((g) => g.biomes.some((b) => b.id === selectedBiomeId))
        .map((g) => ({
          value: g.id.toString(),
          label: g.texts?.[0]?.name || g.identifier,
        }))
    : [];

  const handleBiomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newBiomeId = val ? parseInt(val, 10) : null;
    setFormData((prev: any) => ({
      ...prev,
      biomeId: newBiomeId,
      biomeGameId: null,
    }));
  };

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      biomeGameId: val ? parseInt(val, 10) : null,
    }));
  };

  return (
    <InfoAccordion
      title={tBiome("enclosure")}
      icon="/images/biomes/grassland/enclosure.webp"
      defaultOpen={true}
    >
      <SectionColumn>
        <Label htmlFor="biomeId">{tBiome("enclosureType")}</Label>
        <Selectbox
          id="biomeId"
          name="biomeId"
          value={formData?.biomeId?.toString() ?? ""}
          onChange={handleBiomeChange}
          options={biomeOptions}
          $width="100%"
          placeholder={tCommon("pleaseSelect")}
        />
      </SectionColumn>

      <SectionColumn>
        <Label htmlFor="biomeGameId">{tBiome("game")}</Label>
        <Selectbox
          id="biomeGameId"
          name="biomeGameId"
          value={formData?.biomeGameId?.toString() ?? ""}
          onChange={handleGameChange}
          options={filteredGameOptions}
          $width="100%"
          placeholder={tCommon("pleaseSelect")}
          disabled={!selectedBiomeId}
        />
      </SectionColumn>
    </InfoAccordion>
  );
}
