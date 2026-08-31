"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DatePickerField from "@/components/ui/form/DatePickerField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";

interface BasicInfoSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function BasicInfoSection({ formData, setFormData }: BasicInfoSectionProps) {
  const tAnimals = useTranslations("animal");

  const handleDateChange = (dateString: string | null) => {
    setFormData((prev: any) => ({
      ...prev,
      releaseDate: dateString,
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
          <Label htmlFor="identifier">{tAnimals("basicInfoSection.fields.identifier")}</Label>
          <input
            id="identifier"
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, identifier: e.target.value || null }))
            }
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              width: "100%",
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="releaseDate">{tAnimals("basicInfoSection.fields.releaseDate")}</Label>
          <DatePickerField
            id="releaseDate"
            value={formData.releaseDate}
            onChange={handleDateChange}
            $width="200px"
          />
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
