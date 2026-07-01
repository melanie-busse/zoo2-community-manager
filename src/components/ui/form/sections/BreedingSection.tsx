"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import Selectbox from "@/components/ui/form/Selectbox";
import InputGroup from "@/components/ui/form/InputGroup";
import InputField from "@/components/ui/form/InputField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";

interface BreedingSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function BreedingSection({ formData, setFormData }: BreedingSectionProps) {
  const tAnimals = useTranslations("Animals");
  const tBiome = useTranslations("Biome");
  const tCommon = useTranslations("Common");

  const stallOptions = [
    { value: "0", label: "Level 0" },
    { value: "1", label: "Level 1" },
    { value: "2", label: "Level 2" },
    { value: "3", label: "Level 3" },
  ];

  const handleNumberChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setFormData((prev: any) => {
        const updated = {
          ...prev,
          [key]: val !== "" ? parseInt(val, 10) : null,
        };

        delete updated.breedingCosts;
        delete updated.breedingChance;

        return updated;
      });
    };

  return (
    <InfoAccordion
      title={tAnimals("breeding.breeding") || "Zucht"}
      icon="/images/icons/breeding.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="breedingLevel">{tBiome("shelterLevel")}</Label>
          <Selectbox
            id="breedingLevel"
            name="breedingLevel"
            value={formData?.breedingLevel?.toString() ?? "0"}
            onChange={handleNumberChange("breedingLevel")}
            options={stallOptions}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="breedingCost">{tCommon("price")}</Label>
          <InputGroup icon="/images/currency/zoodollar.webp">
            <InputField
              id="breedingCost"
              name="breedingCost"
              type="number"
              value={formData?.breedingCost ?? ""}
              onChange={handleNumberChange("breedingCost")}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="breedingDuration">{tCommon("time") || "Dauer"}</Label>
          <InputGroup unit="h">
            <InputField
              id="breedingDuration"
              name="breedingDuration"
              type="number"
              value={formData?.breedingDuration ?? ""}
              onChange={handleNumberChange("breedingDuration")}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="breedingProbability">
            {tAnimals("breeding.breedingChance") || "Zuchtchance"}
          </Label>
          <InputGroup unit="%">
            <InputField
              id="breedingProbability"
              name="breedingProbability"
              type="number"
              value={formData?.breedingProbability ?? ""}
              onChange={handleNumberChange("breedingProbability")}
            />
          </InputGroup>
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
