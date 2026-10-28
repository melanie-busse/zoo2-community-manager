"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import SearchableSelect from "@/components/ui/form/SearchableSelect";
import SubmitButton from "@/components/ui/form/SubmitButton";
import { useChestBoostStore } from "@/store/useChestBoostStore";
import type { ChestBoostDetail, ChestType } from "@/types/chestBoost";

interface ChestBoostFormProps {
  animals: { id: number; name: string; identifier: string | null }[];
  initialData?: ChestBoostDetail;
  mode: "create" | "edit";
}

function toDateInput(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ChestBoostForm({ animals, initialData, mode }: ChestBoostFormProps) {
  const t = useTranslations("chestBoosts");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const saveBoost = useChestBoostStore((s) => s.saveBoost);

  const [startDate, setStartDate] = useState(toDateInput(initialData?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initialData?.endDate));
  const [chestType, setChestType] = useState<ChestType>(initialData?.chestType ?? "EPIC");
  const [animalId, setAnimalId] = useState<string>(
    initialData?.animal.id != null ? String(initialData.animal.id) : "",
  );
  const [isEvent, setIsEvent] = useState(initialData?.isEvent ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const animalOptions = animals.map((a) => ({
    value: String(a.id),
    label: a.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!startDate || !endDate) {
      toast.warn(t("validation_dates"));
      return;
    }
    if (!animalId) {
      toast.warn(t("validation_animal"));
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.warn(t("validation_dates"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        chestType,
        isEvent,
        animalId: parseInt(animalId, 10),
      };

      const result = await saveBoost(data, initialData?.id);

      if (result === false) {
        // error already shown via showErrorToast in store
        return;
      }
      if (typeof result === "object" && "error" in result) {
        toast.error(result.message);
        return;
      }

      toast.success(t("save_success"));
      router.push("/game/chests" as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Fields>
        <FieldGroup>
          <Label>{t("form_start_date")}</Label>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_end_date")}</Label>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_chest_type")}</Label>
          <StyledSelect
            value={chestType}
            onChange={(e) => setChestType(e.target.value as ChestType)}
          >
            <option value="EPIC">{t("chest_type_epic")}</option>
            <option value="RETRO">{t("chest_type_retro")}</option>
            <option value="LEGENDARY">{t("chest_type_legendary")}</option>
          </StyledSelect>
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_animal")}</Label>
          <SearchableSelect
            value={animalId}
            onChange={setAnimalId}
            options={animalOptions}
            placeholder="—"
            searchPlaceholder={t("form_animal_search")}
          />
        </FieldGroup>

        <FieldGroup>
          <CheckboxRow>
            <input
              type="checkbox"
              id="isEvent"
              checked={isEvent}
              onChange={(e) => setIsEvent(e.target.checked)}
            />
            <CheckboxLabel htmlFor="isEvent">{t("form_is_event")}</CheckboxLabel>
          </CheckboxRow>
        </FieldGroup>
      </Fields>

      <ButtonRow>
        <SubmitButton
          label={isSubmitting ? tCommon("saving") : t("save")}
          isSubmitting={isSubmitting}
        />
        <CancelButton type="button" onClick={() => router.push("/game/chests" as any)}>
          {t("cancel")}
        </CancelButton>
      </ButtonRow>
    </FormWrapper>
  );
}

const FormWrapper = styled.form`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grey[100]};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 12px 20px;
  border: 2px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 10px;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grey[100]};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;
