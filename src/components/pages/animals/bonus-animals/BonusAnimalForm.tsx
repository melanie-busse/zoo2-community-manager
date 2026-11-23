"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import SearchableSelect from "@/components/ui/form/SearchableSelect";
import SubmitButton from "@/components/ui/form/SubmitButton";
import { confirmDeleteDialog } from "@/utils/alerts";
import {
  createBonusAnimal,
  updateBonusAnimal,
  deleteBonusAnimal,
} from "@/service/frontend/PremiumVipAnimal";
import type { BonusAnimalFormAnimal } from "@/service/PremiumVipAnimalService";
import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

interface Props {
  animals: BonusAnimalFormAnimal[];
  initialData?: PremiumVipAnimalEntryWithAnimal;
  defaultType: "PREMIUM" | "VIP";
  mode: "create" | "edit";
}

function toDateInput(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function BonusAnimalForm({ animals, initialData, defaultType, mode }: Props) {
  const t = useTranslations("animals_bonus");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [type, setType] = useState<"PREMIUM" | "VIP">(
    (initialData?.type as "PREMIUM" | "VIP") ?? defaultType,
  );
  const [year, setYear] = useState(String(initialData?.year ?? new Date().getFullYear()));
  const [dateLabel, setDateLabel] = useState(initialData?.dateLabel ?? "");
  const [startDate, setStartDate] = useState(toDateInput(initialData?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initialData?.endDate));
  const [animalName, setAnimalName] = useState(initialData?.animalName ?? "");
  const [animalId, setAnimalId] = useState<string>(
    initialData?.animalId != null ? String(initialData.animalId) : "",
  );
  const [isNpc, setIsNpc] = useState(initialData?.isNpc ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const animalOptions = animals.map((a) => ({
    value: String(a.id),
    label: a.name,
  }));

  const backPath = type === "PREMIUM" ? "/animals/premium-animals" : "/animals/vip-animals";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      toast.warn(t("validation_year"));
      return;
    }
    if (!dateLabel.trim() || !animalName.trim()) {
      toast.warn(t("validation_required"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        type,
        year: yearNum,
        dateLabel: dateLabel.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
        animalName: animalName.trim(),
        animalId: animalId ? parseInt(animalId, 10) : null,
        isNpc,
      };

      if (mode === "create") {
        await createBonusAnimal(data);
      } else {
        await updateBonusAnimal(initialData!.id, data);
      }

      toast.success(t("save_success"));
      router.push(backPath as any);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    const confirmed = await confirmDeleteDialog({
      title: t("delete_confirm_title"),
      text: t("delete_confirm_text"),
      confirmButtonText: t("delete"),
      cancelButtonText: t("cancel"),
    });
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteBonusAnimal(initialData.id);
      toast.success(t("delete_success"));
      router.push(backPath as any);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Fields>
        <FieldGroup>
          <Label>{t("form_type")}</Label>
          <StyledSelect value={type} onChange={(e) => setType(e.target.value as "PREMIUM" | "VIP")}>
            <option value="PREMIUM">{t("form_type_premium")}</option>
            <option value="VIP">{t("form_type_vip")}</option>
          </StyledSelect>
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_year")} *</Label>
          <StyledInput
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={2000}
            max={2100}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_date_label")} *</Label>
          <StyledInput
            type="text"
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder={t("form_date_label_hint")}
            required
          />
        </FieldGroup>

        <TwoColumns>
          <FieldGroup>
            <Label>{t("form_start_date")}</Label>
            <StyledInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>{t("form_end_date")}</Label>
            <StyledInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FieldGroup>
        </TwoColumns>

        <FieldGroup>
          <Label>{t("form_animal_name")} *</Label>
          <StyledInput
            type="text"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>{t("form_animal_link")}</Label>
          <SearchableSelect
            value={animalId}
            onChange={setAnimalId}
            options={animalOptions}
            placeholder={t("form_no_animal")}
            searchPlaceholder={t("form_animal_link_search")}
          />
        </FieldGroup>

        <FieldGroup>
          <CheckboxRow>
            <input
              type="checkbox"
              id="isNpc"
              checked={isNpc}
              onChange={(e) => setIsNpc(e.target.checked)}
            />
            <CheckboxLabel htmlFor="isNpc">{t("form_is_npc")}</CheckboxLabel>
          </CheckboxRow>
        </FieldGroup>
      </Fields>

      <ButtonRow>
        <SubmitButton
          label={isSubmitting ? tCommon("saving") : t("save")}
          isSubmitting={isSubmitting}
        />
        <CancelButton type="button" onClick={() => router.push(backPath as any)}>
          {t("cancel")}
        </CancelButton>
        {mode === "edit" && (
          <DeleteButton type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? tCommon("saving") : t("delete")}
          </DeleteButton>
        )}
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

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

const StyledInput = styled.input`
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
  margin-top: 24px;
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

const DeleteButton = styled.button`
  padding: 12px 20px;
  border: 2px solid ${({ theme }) => theme.colors.status.errorText};
  border-radius: 10px;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.status.errorText};
  &:hover {
    background: ${({ theme }) => theme.colors.status.errorText};
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
