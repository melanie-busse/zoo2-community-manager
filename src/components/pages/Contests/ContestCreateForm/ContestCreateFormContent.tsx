"use client";

import * as Styles from "./ContestCreateForm.styles";
import { useTranslations } from "next-intl";
import React from "react";
import SubmitButton from "@/components/ui/form/SubmitButton";
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";

interface ContestCreateFormContentProps {
  handleFormSubmit: (e: React.FormEvent) => Promise<void>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedStatues: { id: number; name: string }[];
  availableStatues: { id: number; name: string }[];
  onStatueIdsChange: (ids: number[]) => void;
  specialCoatItems: { id: number; name: string }[];
  selectedSpecialCoatIds: number[];
  onSpecialCoatIdsChange: (ids: number[]) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function ContestCreateFormContent({
  handleFormSubmit,
  formData,
  setFormData,
  selectedStatues,
  availableStatues,
  onStatueIdsChange,
  specialCoatItems,
  selectedSpecialCoatIds,
  onSpecialCoatIdsChange,
  isSubmitting,
  onCancel,
}: ContestCreateFormContentProps) {
  const t = useTranslations("contest");
  const tCommon = useTranslations("common");

  return (
    <form onSubmit={handleFormSubmit}>
      <Styles.Row>
        <Styles.InputGroup>
          <label>{t("contestForm.startDate")}</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value,
              })
            }
          />
        </Styles.InputGroup>

        <Styles.InputGroup>
          <label>{t("contestForm.endDate")}</label>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                endDate: e.target.value,
              })
            }
            required
          />
        </Styles.InputGroup>

        <Styles.CheckboxGroup>
          <Styles.checkboxContainer>
            <input
              type="checkbox"
              id="active"
              checked={formData.active === 1}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="active">{t("contestForm.activeContest")}</label>
          </Styles.checkboxContainer>
        </Styles.CheckboxGroup>
      </Styles.Row>

      <Styles.SectionHeadline>
        {t("contestForm.statuesChoise")} ({selectedStatues.length} / 3)
      </Styles.SectionHeadline>

      <OriginTransfer
        allOrigins={[...availableStatues, ...selectedStatues]}
        selectedIds={selectedStatues.map((s) => s.id)}
        onChange={onStatueIdsChange}
        maxSelected={3}
      />

      <Styles.SectionHeadline>
        {t("contestForm.specialCoatsChoice")} ({selectedSpecialCoatIds.length} / 1)
      </Styles.SectionHeadline>

      <OriginTransfer
        allOrigins={specialCoatItems}
        selectedIds={selectedSpecialCoatIds}
        onChange={onSpecialCoatIdsChange}
        maxSelected={1}
      />

      <Styles.ButtonRow>
        <SubmitButton
          label={isSubmitting ? tCommon("save_changes") : t("contestForm.saveContest")}
          isSubmitting={isSubmitting}
        />
        {onCancel && (
          <Styles.CancelButton type="button" onClick={onCancel}>
            {tCommon("messages.cancel")}
          </Styles.CancelButton>
        )}
      </Styles.ButtonRow>
    </form>
  );
}
