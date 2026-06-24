"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import { languageFlags } from "@/constants/languageFlags";

interface TranslationSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  dbLanguages: Array<{ code: string; name: string }>;
}

export default function TranslationSection({
  formData,
  setFormData,
  dbLanguages,
}: TranslationSectionProps) {
  const tAnimals = useTranslations("Animals");

  const currentTexts = Array.isArray(formData?.animaltext) ? formData.animaltext : [];

  const languageOptions = Array.isArray(dbLanguages)
    ? dbLanguages.map((lang) => ({
        value: lang.code,
        label: lang.name,
        icon: languageFlags[lang.code as keyof typeof languageFlags],
      }))
    : [];

  const rows = currentTexts.map((t: any) => ({
    id: t.languageCode || Math.random().toString(),
    languageCode: t.languageCode || "",
    animalName: t.animalName || "",
    animalDescription: t.animalDescription || "",
  }));

  const onAdd = () => {
    const usedCodes = currentTexts.map((t: any) => t.languageCode);
    const nextAvailable = languageOptions.find((opt) => !usedCodes.includes(opt.value));

    if (nextAvailable) {
      setFormData((prev: any) => ({
        ...prev,
        animaltext: [
          ...(Array.isArray(prev.animaltext) ? prev.animaltext : []),
          {
            languageCode: nextAvailable.value,
            animalName: "",
            animalDescription: "",
          },
        ],
      }));
    }
  };

  const onRemove = (id: number | string) => {
    setFormData((prev: any) => ({
      ...prev,
      animaltext: prev.animaltext.filter((t: any) => t.languageCode !== id),
    }));
  };

  const onChange = (id: number | string, field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      animaltext: prev.animaltext.map((t: any) =>
        t.languageCode === id ? { ...t, [field]: val } : t,
      ),
    }));
  };

  const allLanguagesUsed =
    languageOptions.length > 0 && currentTexts.length >= languageOptions.length;

  return (
    <InfoAccordion
      title={tAnimals("translationSection.title")}
      icon="/images/icons/globus.png"
      defaultOpen={true}
    >
      <Styles.SectionColumn>
        <DynamicRowInput
          label=""
          rows={rows}
          columns={[
            {
              key: "languageCode",
              label: tAnimals("translationSection.fields.language"),
              type: "select",
              $flex: 0.5,
              options: languageOptions,
            },
            {
              key: "animalName",
              label: tAnimals("translationSection.fields.name"),
              type: "text",
              $flex: 0.7,
              placeholder: "Name",
            },
            {
              key: "animalDescription",
              label: tAnimals("translationSection.fields.description"),
              type: "textarea",
              $flex: 1.2,
              placeholder: tAnimals("translationSection.fields.descriptionPlaceholder"),
            },
          ]}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
          disabledAdd={allLanguagesUsed}
        />
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
