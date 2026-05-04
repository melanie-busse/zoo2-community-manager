import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

import { Contest } from "@/types/contest";
import { formatLocaleDate } from "@/utils/formatDate";
import { ContestCreateFormContent } from "@/components/pages/Contests/ContestCreateForm/ContestCreateFormContent";
import { Statue } from "@/types/statue";
import { getStatueName } from "@/utils/ContestUtil";

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
  const locale = useLocale();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        start: formatLocaleDate(initialData.startDate, locale),
        ende: formatLocaleDate(initialData.endDate, locale),
        aktiv: initialData.active ?? 1,
      };
    }

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

    return {
      start: formatLocaleDate(start, locale),
      ende: formatLocaleDate(end, locale),
      aktiv: 1,
    };
  });

  // 2. Gewählte Statuen initialisieren
  const [selectedStatues, setSelectedStatues] = useState<{ id: number; name: string }[]>(() => {
    if (initialData?.conteststatue) {
      return initialData.conteststatue.map((link: any) => {
        const animal = link.statue.animal;
        return {
          id: link.statue.id,
          name: animal?.name || link.statue.name,
        };
      });
    }
    return [];
  });

  // Verfügbare Statuen filtern & formatieren
  const availableStatues = (statues || [])
    .filter((statue) => !selectedStatues.find((selectedStatue) => selectedStatue.id === statue.id))
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

    if (selectedStatues.length !== 4) {
      toast.error(t("Contest.contestForm.chooseStatues"));
      return;
    }

    if (new Date(formData.ende) < new Date(formData.start)) {
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
