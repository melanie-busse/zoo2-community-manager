"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";

interface BasicInfoSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function BasicInfoSection({ formData, setFormData }: BasicInfoSectionProps) {
  const tAnimals = useTranslations("Animals");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    setFormData((prev: any) => ({
      ...prev,
      releaseDate: nextValue || null,
    }));
  };

  return (
    <InfoAccordion
      title={tAnimals("basicInfoSection.basicInfo") || "Stammdaten"}
      icon="/images/icons/info.png"
      defaultOpen={true}
    >
      <Styles.SectionColumn>
        <Styles.FormGroup>
          <Styles.Label htmlFor="releaseDate">
            {tAnimals("basicInfoSection.fields.releaseDate")}
          </Styles.Label>
          <InputField
            id="releaseDate"
            type="date"
            name="releaseDate"
            value={formData.releaseDate || ""}
            onChange={handleDateChange}
            $width="200px"
          />
        </Styles.FormGroup>
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
