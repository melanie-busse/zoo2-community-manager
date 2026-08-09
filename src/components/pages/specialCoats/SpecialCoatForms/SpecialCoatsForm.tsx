"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
import { mapSpecialCoatToForm } from "@/utils/SpecialCoatUtil";
import styled from "styled-components";
import { BreedingChanceSection } from "@/components/ui/form/sections/BreedingChanceSection";

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
  const tSpecialCoat = useTranslations("specialCoat");
  const tCommon = useTranslations("common");
  const router = useRouter();
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

  const [formData, setFormData] = useState<any>(() => mapSpecialCoatToForm(specialCoat, languages));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const savedId = await saveSpecialCoat(formData);

      if (savedId && typeof savedId === "object" && (savedId as any).error === "MayorReadonly") {
        toast.info((savedId as any).message || tSpecialCoat("messages.mayorReadonlyNotice"));
        setIsSubmitting(false);
        return;
      }

      if (savedId !== false) {
        clearEditingSpecialCoat();
        toast.success(
          tSpecialCoat(formData.id ? "messages.editSuccess" : "messages.createSuccess"),
        );
        router.push("/specialcoats");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <Column>
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <AnimalSelectSection
            animalsData={animalData}
            formData={formData}
            setFormData={setFormData}
          />
        </Column>

        <ColumnRight>
          <SpecialCoatTranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />

          <BreedingChanceSection formData={formData} setFormData={setFormData} />

          <OriginSection
            originsData={originsData}
            selectedOrigins={formData.origins || []}
            setFormData={setFormData}
          />
        </ColumnRight>
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

const ColumnRight = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
