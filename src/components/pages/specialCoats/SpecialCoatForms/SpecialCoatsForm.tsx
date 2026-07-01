"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import SubmitButton from "@/components/ui/form/SubmitButton";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { SpecialCoat } from "@/types/specialCoat";
import BasicInfoSection from "@/components/ui/form/sections/BasicInfoSection";
import OriginSection from "@/components/ui/form/sections/OriginSection";
import FooterSection from "@/components/ui/form/sections/FooterSection";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";
import AnimalSelectSection from "@/components/ui/form/sections/AnimalSelectSection";
import SpecialCoatTranslationSection from "@/components/ui/form/sections/SpecialCoatTranslationSection";

const mapSpecialCoatToForm = (coat: any, languages: any[]) => {
  if (!coat) return { origins: [], translations: {} };
  return coat;
};

interface OriginOption {
  id: number;
  name: string;
}

interface SpecialCoatFormProps {
  animalData: any[];
  specialCoat?: SpecialCoat;
  languages: Array<{ code: string; name: string }>;
  originsData: OriginOption[];
}

export default function SpecialCoatForm({
  animalData,
  specialCoat,
  languages,
  originsData,
}: SpecialCoatFormProps) {
  const tSpecialCoat = useTranslations("SpecialCoat");
  const tCommon = useTranslations("Common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingSpecialCoat = useSpecialCoatStore((state) => state.editingSpecialCoat);
  const setEditingSpecialCoat = useSpecialCoatStore((state) => state.setEditingSpecialCoat);
  const saveSpecialCoat = useSpecialCoatStore((state) => state.saveSpecialCoat);
  const clearEditingSpecialCoat = useSpecialCoatStore((state) => state.clearEditingSpecialCoat);

  useEffect(() => {
    if (specialCoat) {
      setEditingSpecialCoat(specialCoat);
    } else {
      clearEditingSpecialCoat();
    }
  }, [specialCoat, setEditingSpecialCoat, clearEditingSpecialCoat]);

  const [formData, setFormData] = useState<any>(() =>
    mapSpecialCoatToForm(specialCoat || editingSpecialCoat, languages),
  );

  useEffect(() => {
    setFormData(mapSpecialCoatToForm(editingSpecialCoat, languages));
  }, [editingSpecialCoat, languages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await saveSpecialCoat(formData);
      if (success) {
        clearEditingSpecialCoat();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <FormGrid>
        {/* 1. Spalte links: Grundinfos und Tierauswahl */}
        <Column>
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <AnimalSelectSection
            animalsData={animalData}
            formData={formData}
            setFormData={setFormData}
          />
        </Column>

        {/* 2. Spalte rechts ODER über die volle Breite brechend */}
        {/* Mit gridColumn: "1 / -1" zwingen wir dieses Div, sich über die gesamte Breite des Rasters zu strecken */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          <SpecialCoatTranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />
          <OriginSection
            originsData={originsData}
            selectedOrigins={formData.origins || []}
            setFormData={setFormData}
          />
        </div>
      </FormGrid>

      <FooterSection>
        <SubmitButton
          label={isSubmitting ? tCommon("saving") : tSpecialCoat("form.saveSpecialCoat")}
          isSubmitting={isSubmitting}
        />
      </FooterSection>
    </form>
  );
}
