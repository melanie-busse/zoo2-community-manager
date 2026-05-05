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

  return (
    <form onSubmit={handleFormSubmit}>
      <Styles.Row>
        <Styles.InputGroup>
          <label>{t("Contest.contestForm.startDate")}</label>
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
          <label>{t("Contest.contestForm.endDate")}</label>
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
          <input
            type="checkbox"
            id="active"
            checked={formData.active === 1}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked ? 1 : 0 })}
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
