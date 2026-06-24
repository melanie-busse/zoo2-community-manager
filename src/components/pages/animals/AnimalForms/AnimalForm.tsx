"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import * as Styles from "./AnimalForms.style";

import BreedingSection from "./BreedingSection";
import PriceSection from "./PriceSection";
import BasicInfoSection from "./BasicInfoSection";
import XpActionSection from "./XpActionSection";
import EnclosureCapacitySection from "./EnclosureCapacitySection";
import EnclosureTypeSection from "./EnclosureTypeSection";
import OriginSection from "./OriginSection";
import TranslationSection from "@/components/pages/animals/AnimalForms/TranslationSection";
import SubmitButton from "@/components/ui/form/SubmitButton";
import { useAnimalStore } from "@/store/useAnimalStore";
import { Animal } from "@/types/animal";
import { Biome } from "@/types/biome";
import { mapAnimalToForm } from "@/utils/AnimalUtil";

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
      <Styles.FormGrid>
        <Styles.Column>
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <EnclosureTypeSection formData={formData} setFormData={setFormData} biomes={biomes} />
          <TranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />
        </Styles.Column>

        <Styles.Column>
          <PriceSection formData={formData} setFormData={setFormData} />
          <BreedingSection formData={formData} setFormData={setFormData} />
          <XpActionSection formData={formData} setFormData={setFormData} />
          <EnclosureCapacitySection
            enclosureSizes={formData.enclosureSizes}
            setFormData={setFormData}
          />
        </Styles.Column>
      </Styles.FormGrid>

      <Styles.FooterSection>
        <OriginSection
          originsData={originsData}
          selectedOrigins={formData.origins || []}
          setFormData={setFormData}
        />

        <SubmitButton
          label={isSubmitting ? tCommon("saving") : tAnimals("form.saveAnimal")}
          isSubmitting={isSubmitting}
        />
      </Styles.FooterSection>
    </form>
  );
}
