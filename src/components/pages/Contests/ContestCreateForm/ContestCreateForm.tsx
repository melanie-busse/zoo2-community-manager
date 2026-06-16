"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { Contest } from "@/types/contest";
import { ContestCreateFormContent } from "@/components/pages/Contests/ContestCreateForm/ContestCreateFormContent";
import { Statue } from "@/types/statue";
import { getStatueName } from "@/utils/ContestUtil";
import { toISODate } from "@/utils/DateUtil";

interface ContestFormProps {
  statues?: Statue[];
  initialData?: Contest | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function ContestForm({
  statues = [],
  initialData = null,
  onSubmit,
}: ContestFormProps) {
  const t = useTranslations();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Formular-Daten State
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    active: 1,
  });

  // 2. Gewählte Statuen State
  const [selectedStatues, setSelectedStatues] = useState<{ id: number; name: string }[]>([]);

  // 3. Effekt zum Laden der Daten (wichtig für den Edit-Modus)
  useEffect(() => {
    if (initialData) {
      setFormData({
        startDate: toISODate(initialData.startDate),
        endDate: toISODate(initialData.endDate),
        active: initialData.active ? 1 : 0,
      });

      if (initialData.conteststatue) {
        const preselected = initialData.conteststatue.map((link: any) => ({
          id: link.statue?.id,
          name: getStatueName(link.statue, "Unbekannte Statue"),
        }));
        setSelectedStatues(preselected);
      }
    } else {
      // Default-Werte für neuen Contest (nächster Mittwoch)
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

  // Verfügbare Statuen filtern (alle minus die bereits gewählten)
  const availableStatues = (statues || [])
    .filter((statue) => !selectedStatues.find((s) => s.id === statue.id))
    .map((statue) => ({
      id: statue.id,
      name: getStatueName(statue, "Unbekannte Statue"),
    }));

  const handleMoveRight = (statue: { id: number; name: string }) => {
    if (selectedStatues.length >= 4) {
      toast.warn(t("Contest.contestForm.maxStatues"));
      return;
    }
    setSelectedStatues([...selectedStatues, statue]);
  };

  const handleMoveLeft = (statue: { id: number; name: string }) => {
    setSelectedStatues(selectedStatues.filter((s) => s.id !== statue.id));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung: Zoo 2 Contests benötigen immer genau 4 Statuen
    if (selectedStatues.length < 3 || selectedStatues.length > 4) {
      toast.error(t("Contest.contestForm.chooseStatues"));
      return;
    }

    // Validierung: Datum
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error(t("Contest.contestForm.endDateBeforeStart"));
      return;
    }

    const submissionData = {
      ...formData,
      statuenIds: selectedStatues.map((s) => s.id),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(t("Common.error"));
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
      handleMoveRight={handleMoveRight}
      handleMoveLeft={handleMoveLeft}
      isSubmitting={isSubmitting}
    />
  );
}
