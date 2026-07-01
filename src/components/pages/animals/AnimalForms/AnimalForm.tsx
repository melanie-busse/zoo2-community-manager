"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { BreedingSection } from "@/components/ui/form/sections/BreedingSection";
import PriceSection from "@/components/ui/form/sections/PriceSection";
import BasicInfoSection from "@/components/ui/form/sections/BasicInfoSection";
import XpActionSection from "@/components/ui/form/sections/XpActionSection";
import EnclosureCapacitySection from "@/components/ui/form/sections/EnclosureCapacitySection";
import EnclosureTypeSection from "@/components/ui/form/sections/EnclosureTypeSection";
import OriginSection from "@/components/ui/form/sections/OriginSection";
import AnimalTranslationSection from "@/components/ui/form/sections/AnimalTranslationSection";
import SubmitButton from "@/components/ui/form/SubmitButton";

import { useAnimalStore } from "@/store/useAnimalStore";
import { Animal } from "@/types/animal";
import { Biome } from "@/types/biome";
import { mapAnimalToForm } from "@/utils/AnimalUtil";

import FooterSection from "@/components/ui/form/sections/FooterSection";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";

interface OriginOption {
  id: number;
  name: string;
}

interface AnimalFormProps {
  animal?: Animal;
  languages: Array<{ code: string; name: string }>;
  biomes: Biome[];
  originsData: OriginOption[];
}

export default function AnimalForm({ animal, languages, biomes, originsData }: AnimalFormProps) {
  const tAnimals = useTranslations("Animals");
  const tCommon = useTranslations("Common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingAnimal = useAnimalStore((state) => state.editingAnimal);
  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const saveAnimal = useAnimalStore((state) => state.saveAnimal);
  const clearEditingAnimal = useAnimalStore((state) => state.clearEditingAnimal);

  useEffect(() => {
    if (animal) {
      setEditingAnimal(animal);
    } else {
      clearEditingAnimal();
    }
  }, [animal, setEditingAnimal, clearEditingAnimal]);

  const [formData, setFormData] = useState<any>(() =>
    mapAnimalToForm(animal || editingAnimal, languages),
  );

  useEffect(() => {
    setFormData(mapAnimalToForm(editingAnimal, languages));
  }, [editingAnimal, languages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.biomeId) {
      toast.warn("Bitte wähle ein Gehege aus!");
      return;
    }

    setIsSubmitting(true);
    const success = await saveAnimal(formData);
    setIsSubmitting(false);

    if (success) {
      clearEditingAnimal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <Column>
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <EnclosureTypeSection formData={formData} setFormData={setFormData} biomes={biomes} />
          <AnimalTranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />
        </Column>

        <Column>
          <PriceSection formData={formData} setFormData={setFormData} />
          <BreedingSection formData={formData} setFormData={setFormData} />
          <XpActionSection formData={formData} setFormData={setFormData} />
          <EnclosureCapacitySection
            enclosureSizes={formData.enclosureSizes}
            setFormData={setFormData}
          />
        </Column>
      </FormGrid>

      <FooterSection>
        <OriginSection
          originsData={originsData}
          selectedOrigins={formData.origins || []}
          setFormData={setFormData}
        />

        <SubmitButton
          label={isSubmitting ? tCommon("saving") : tAnimals("form.saveAnimal")}
          isSubmitting={isSubmitting}
        />
      </FooterSection>
    </form>
  );
}
