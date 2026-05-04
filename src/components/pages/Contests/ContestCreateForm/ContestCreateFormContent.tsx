"use client";

import * as Styles from "./ContestCreateForm.styles";
import { useLocale, useTranslations } from "next-intl";
import { formatLocaleDate } from "@/utils/formatDate";
import React from "react";
import SubmitButton from "@/components/ui/form/SubmitButton";
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";

interface ContestCreateFormContentProps {
  handleFormSubmit: (e: React.FormEvent) => Promise<void>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedStatues: any[];
  availableStatues: any[];
  handleMoveRight: (statue: any) => void;
  handleMoveLeft: (statue: any) => void;
  isSubmitting: boolean;
}

export function ContestCreateFormContent({
  handleFormSubmit,
  formData,
  setFormData,
  selectedStatues,
  availableStatues,
  handleMoveRight,
  handleMoveLeft,
  isSubmitting,
}: ContestCreateFormContentProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <form onSubmit={handleFormSubmit}>
      <Styles.Row>
        <Styles.InputGroup>
          <label>{t("Contest.contestForm.startDate")}</label>
          <input
            type="date"
            value={formData.start}
            onChange={(e) => {
              const newStart = e.target.value;
              const startDate = new Date(newStart);
              const newEnd = new Date(startDate);
              newEnd.setDate(startDate.getDate() + 7);

              setFormData({
                ...formData,
                start: newStart,
                ende: formatLocaleDate(newEnd, locale),
              });
            }}
            required
          />
        </Styles.InputGroup>

        <Styles.InputGroup>
          <label>{t("Contest.contestForm.endDate")}</label>
          <input
            type="date"
            value={formData.ende}
            min={formData.start}
            onChange={(e) => setFormData({ ...formData, ende: e.target.value })}
            required
          />
        </Styles.InputGroup>

        <Styles.CheckboxGroup>
          <input
            type="checkbox"
            id="aktiv"
            checked={formData.aktiv === 1}
            onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked ? 1 : 0 })}
          />
          <label htmlFor="aktiv">{t("Contest.contestForm.activeContest")}</label>
        </Styles.CheckboxGroup>
      </Styles.Row>

      <Styles.SectionHeadline>
        {t("Contest.contestForm.statuesChoise")} ({selectedStatues.length} / 4)
      </Styles.SectionHeadline>

      <OriginTransfer
        available={availableStatues}
        selected={selectedStatues}
        onMoveRight={handleMoveRight}
        onMoveLeft={handleMoveLeft}
        maxSelected={4}
      />

      <SubmitButton
        label={isSubmitting ? t("Common.save_changes") : t("Contest.contestForm.saveContest")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
