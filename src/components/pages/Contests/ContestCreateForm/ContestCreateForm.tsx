"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { Contest } from "@/types/contest";
import { ContestCreateFormContent } from "@/components/pages/contests/ContestCreateForm/ContestCreateFormContent";
import { Animal } from "@/types/animal";
import { SpecialCoat } from "@/types/specialCoat";
import { getStatueName } from "@/utils/ContestUtil";
import { toISODate } from "@/utils/DateUtil";

interface ContestFormProps {
  statues?: Animal[];
  contestSpecialCoats?: SpecialCoat[];
  initialData?: Contest | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export default function ContestForm({
  statues = [],
  contestSpecialCoats = [],
  initialData = null,
  onSubmit,
  onCancel,
}: ContestFormProps) {
  const tContest = useTranslations("contest");
  const tCommon = useTranslations("common");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    active: 1,
  });

  const [selectedStatues, setSelectedStatues] = useState<{ id: number; name: string }[]>([]);

  const [selectedSpecialCoatIds, setSelectedSpecialCoatIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        startDate: toISODate(initialData.startDate),
        endDate: toISODate(initialData.endDate),
        active: initialData.active ? 1 : 0,
      });

      if (initialData.conteststatue) {
        const preselected = initialData.conteststatue.map((link: any) => ({
          id: link.animal?.id,
          name: getStatueName(link.animal, tContest("contestForm.unknown_statue")),
        }));

        setSelectedStatues(preselected);
      }

      if (initialData.contestspecialcoat) {
        setSelectedSpecialCoatIds(
          initialData.contestspecialcoat.map((link: any) => link.specialCoatId),
        );
      }
    } else {
      // Default-Value for new Contest (next Wednesday)
      const getNextWednesday = (date: Date) => {
        const result = new Date(date);
        const day = result.getDay();
        const diff = (3 - day + 7) % 7;
        result.setDate(result.getDate() + (diff === 0 ? 7 : diff));
        return result;
      };

      const start = getNextWednesday(new Date());
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      setFormData({
        startDate: toISODate(start),
        endDate: toISODate(end),
        active: 1,
      });
    }
  }, [initialData]);

  const specialCoatItems = (contestSpecialCoats || []).map((coat) => ({
    id: coat.id,
    name:
      coat.specialcoatstext?.[0]?.name ||
      coat.animal?.animaltext?.[0]?.animalName ||
      `Coat #${coat.id}`,
  }));

  const availableStatues = (statues || [])
    .filter((animal) => !selectedStatues.find((s) => s.id === animal.id))
    .map((animal) => ({
      id: animal.id,
      name: getStatueName(animal, tContest("contestForm.unknown_statue")),
    }));

  const handleStatueIdsChange = (newIds: number[]) => {
    const allStatues = (statues || []).map((animal) => ({
      id: animal.id,
      name: getStatueName(animal, tContest("contestForm.unknown_statue")),
    }));
    setSelectedStatues(allStatues.filter((s) => newIds.includes(s.id)));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung: Zoo 2 Contests benötigen immer genau 3 Statuen
    if (selectedStatues.length < 2 || selectedStatues.length > 3) {
      toast.error(tContest("contestForm.chooseStatues"));
      return;
    }

    // Validierung: Datum
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error(tContest("contestForm.endDateBeforeStart"));
      return;
    }

    const submissionData = {
      ...formData,
      statuenIds: selectedStatues.map((s) => s.id),
      specialCoatIds: selectedSpecialCoatIds,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(tCommon("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContestCreateFormContent
      handleFormSubmit={handleFormSubmit}
      formData={formData}
      setFormData={setFormData}
      selectedStatues={selectedStatues}
      availableStatues={availableStatues}
      onStatueIdsChange={handleStatueIdsChange}
      specialCoatItems={specialCoatItems}
      selectedSpecialCoatIds={selectedSpecialCoatIds}
      onSpecialCoatIdsChange={setSelectedSpecialCoatIds}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
    />
  );
}
