"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";

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
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="releaseDate">{tAnimals("basicInfoSection.fields.releaseDate")}</Label>
          <InputField
            id="releaseDate"
            type="date"
            name="releaseDate"
            value={formData.releaseDate || ""}
            onChange={handleDateChange}
            $width="200px"
          />
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
