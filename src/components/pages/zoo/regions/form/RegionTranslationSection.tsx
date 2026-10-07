"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import { FLAG_MAP } from "@/constants/languages";

interface RegionTranslationSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  dbLanguages: Array<{ code: string; name: string }>;
}

export default function RegionTranslationSection({
  formData,
  setFormData,
  dbLanguages,
}: RegionTranslationSectionProps) {
  const tRegion = useTranslations("region");

  const currentTexts = Array.isArray(formData?.regionTexts) ? formData.regionTexts : [];

  const languageOptions = Array.isArray(dbLanguages)
    ? dbLanguages.map((lang) => ({
        value: lang.code,
        label: lang.name,
        icon: FLAG_MAP[lang.code] || "fi-un",
      }))
    : [];

  const rows = currentTexts.map((t: any, index: number) => ({
    id: t.languageCode || String(index),
    languageCode: t.languageCode || "",
    name: t.name || "",
  }));

  const onAdd = () => {
    const usedCodes = currentTexts.map((t: any) => t.languageCode);
    const nextAvailable = languageOptions.find((opt) => !usedCodes.includes(opt.value));
    if (nextAvailable) {
      setFormData((prev: any) => ({
        ...prev,
        regionTexts: [
          ...(Array.isArray(prev.regionTexts) ? prev.regionTexts : []),
          { languageCode: nextAvailable.value, name: "" },
        ],
      }));
    }
  };

  const onRemove = (id: number | string) => {
    setFormData((prev: any) => ({
      ...prev,
      regionTexts: prev.regionTexts.filter((t: any) => t.languageCode !== id),
    }));
  };

  const onChange = (id: number | string, field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      regionTexts: prev.regionTexts.map((t: any) =>
        t.languageCode === id ? { ...t, [field]: val } : t,
      ),
    }));
  };

  const allLanguagesUsed =
    languageOptions.length > 0 && currentTexts.length >= languageOptions.length;

  return (
    <InfoAccordion
      title={tRegion("form.translations")}
      icon="/images/icons/globus.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <DynamicRowInput
          label=""
          rows={rows}
          columns={[
            {
              key: "languageCode",
              label: "Sprache",
              type: "select",
              $flex: 0.5,
              options: languageOptions,
            },
            {
              key: "name",
              label: "Name",
              type: "text",
              $flex: 1,
              placeholder: "Name",
            },
          ]}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
          disabledAdd={allLanguagesUsed}
        />
      </SectionColumn>
    </InfoAccordion>
  );
}
