"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import { languageFlags } from "@/constants/languageFlags";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";

interface SpecialCoatTranslationSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  dbLanguages: Array<{ code: string; name: string }>;
}

export default function SpecialCoatTranslationSection({
  formData,
  setFormData,
  dbLanguages,
}: SpecialCoatTranslationSectionProps) {
  const tSpecialCoat = useTranslations("SpecialCoat");

  const currentTexts = Array.isArray(formData?.texts) ? formData.texts : [];

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
    name: t.name || "",
    color: t.color || "",
  }));

  const onAdd = () => {
    const usedCodes = currentTexts.map((t: any) => t.languageCode);
    const nextAvailable = languageOptions.find((opt) => !usedCodes.includes(opt.value));

    if (nextAvailable) {
      setFormData((prev: any) => ({
        ...prev,
        texts: [
          ...(Array.isArray(prev.texts) ? prev.texts : []),
          {
            languageCode: nextAvailable.value,
            name: "",
            color: "",
          },
        ],
      }));
    }
  };

  const onRemove = (id: number | string) => {
    setFormData((prev: any) => ({
      ...prev,
      texts: prev.texts.filter((t: any) => t.languageCode !== id),
    }));
  };

  const onChange = (id: number | string, field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      texts: prev.texts.map((t: any) => (t.languageCode === id ? { ...t, [field]: val } : t)),
    }));
  };

  const allLanguagesUsed =
    languageOptions.length > 0 && currentTexts.length >= languageOptions.length;

  return (
    <InfoAccordion
      title={tSpecialCoat("form.translationSection.title")}
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
              label: tSpecialCoat("form.translationSection.fields.language"),
              type: "select",
              $flex: 0.5,
              options: languageOptions,
            },
            {
              key: "name",
              label: tSpecialCoat("form.translationSection.fields.name"),
              type: "text",
              $flex: 0.8,
              placeholder: tSpecialCoat("form.translationSection.fields.NamePlaceholder"),
            },
            {
              key: "color",
              label: tSpecialCoat("form.translationSection.fields.color"),
              type: "text",
              $flex: 0.8,
              placeholder: tSpecialCoat("form.translationSection.fields.ColorPlaceholder"),
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
