"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import SubmitButton from "@/components/ui/form/SubmitButton";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import { createCollectionOnClient, updateCollectionOnClient } from "@/service/frontend/Collection";
import { SUPPORTED_LANGUAGES, FLAG_MAP } from "@/constants/languages";
import type { RawCollection } from "@/types/collection";

interface CollectionFormProps {
  collection?: RawCollection;
  allAnimals: { id: number; identifier: string; name: string; image?: string }[];
  allStatues: { id: number; animalName: string; contestName: string }[];
  allRegions: { id: number; identifier: string; name: string }[];
  allVariants: { value: string; label: string; image?: string }[];
}

interface TextRow {
  languageCode: string;
  name: string;
}

interface RequirementRow {
  id: number;
  type: "ANIMAL" | "STATUE";
  itemId: string;
  requiredLevel: string;
}

export default function CollectionForm({
  collection,
  allAnimals,
  allStatues,
  allRegions,
  allVariants,
}: CollectionFormProps) {
  const t = useTranslations("collections");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [regionId, setRegionId] = useState<string>(
    collection?.regionId != null ? String(collection.regionId) : "",
  );
  const [rewardAnimalId, setRewardAnimalId] = useState<string>(
    collection?.rewardAnimalId != null ? String(collection.rewardAnimalId) : "",
  );
  const [rewardSpecialCoatId, setRewardSpecialCoatId] = useState<string>(
    collection?.rewardSpecialCoatId != null ? String(collection.rewardSpecialCoatId) : "",
  );
  const [stars, setStars] = useState<string>(
    collection?.stars != null ? String(collection.stars) : "1",
  );

  const [texts, setTexts] = useState<TextRow[]>(
    collection?.texts.map((t) => ({ languageCode: t.languageCode, name: t.name })) ?? [],
  );

  const [requirements, setRequirements] = useState<RequirementRow[]>(
    collection?.requirements.map((r, i) => ({
      id: i,
      type: r.type,
      itemId:
        r.type === "ANIMAL"
          ? r.animalId != null
            ? String(r.animalId)
            : ""
          : r.statueId != null
            ? String(r.statueId)
            : "",
      requiredLevel: r.requiredLevel != null ? String(r.requiredLevel) : "",
    })) ?? [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Translations DynamicRowInput ---
  const languageOptions = SUPPORTED_LANGUAGES.map((l) => ({
    value: l.code,
    label: l.name,
    icon: FLAG_MAP[l.code] || "fi-un",
  }));
  const usedCodes = texts.map((t) => t.languageCode);
  const allLanguagesUsed = texts.length >= SUPPORTED_LANGUAGES.length;

  const onAddText = () => {
    const next = languageOptions.find((opt) => !usedCodes.includes(opt.value));
    if (next) setTexts((prev) => [...prev, { languageCode: next.value, name: "" }]);
  };
  const onRemoveText = (id: number | string) =>
    setTexts((prev) => prev.filter((t) => t.languageCode !== id));
  const onChangeText = (id: number | string, key: string, value: string) =>
    setTexts((prev) => prev.map((t) => (t.languageCode === id ? { ...t, [key]: value } : t)));

  // --- Requirements ---
  const animalOptions = allAnimals.map((a) => ({
    value: String(a.id),
    label: a.name || a.identifier,
  }));
  const statueOptions = allStatues.map((s) => ({
    value: String(s.id),
    label: `${s.animalName} (${s.contestName})`,
  }));

  const onAddRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      { id: Date.now(), type: "ANIMAL", itemId: "", requiredLevel: "" },
    ]);
  };
  const onRemoveRequirement = (rowId: number | string) =>
    setRequirements((prev) => prev.filter((r) => r.id !== rowId));
  const onChangeRequirement = (rowId: number | string, key: string, value: string) =>
    setRequirements((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        // Beim Wechsel des Typs das itemId zurücksetzen
        if (key === "type") return { ...r, type: value as "ANIMAL" | "STATUE", itemId: "" };
        return { ...r, [key]: value };
      }),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!regionId) {
      toast.warn(t("form.messages.requiredRegion"));
      return;
    }
    const hasName = texts.some((tx) => tx.name.trim());
    if (!hasName) {
      toast.warn(t("form.messages.requiredName"));
      return;
    }

    const payload = {
      regionId: parseInt(regionId),
      rewardAnimalId: rewardAnimalId !== "" ? parseInt(rewardAnimalId) : null,
      rewardSpecialCoatId: rewardSpecialCoatId !== "" ? parseInt(rewardSpecialCoatId) : null,
      stars: parseInt(stars) || 1,
      texts: texts.filter((tx) => tx.name.trim()),
      requirements: requirements.map((r, i) => ({
        type: r.type,
        animalId: r.type === "ANIMAL" && r.itemId !== "" ? parseInt(r.itemId) : null,
        statueId: r.type === "STATUE" && r.itemId !== "" ? parseInt(r.itemId) : null,
        requiredLevel: r.requiredLevel !== "" ? parseInt(r.requiredLevel) : null,
        sortOrder: i,
      })),
    };

    setIsSubmitting(true);
    try {
      if (collection) {
        await updateCollectionOnClient(collection.id, payload);
        toast.success(t("form.messages.editSuccess"));
      } else {
        await createCollectionOnClient(payload);
        toast.success(t("form.messages.createSuccess"));
      }
      router.push("/animals/collections");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <CardsColumn>
        {/* Kopfdaten */}
        <InfoAccordion title={t("form.region")} icon="/images/icons/buildings.png" defaultOpen>
          <Fields>
            <FieldGroup>
              <Label>{t("form.region")}</Label>
              <Select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
                <option value="">—</option>
                {allRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name || r.identifier}
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label>{t("form.reward_animal")}</Label>
              <SearchableSelect
                value={rewardAnimalId}
                onChange={setRewardAnimalId}
                options={allAnimals.map((a) => ({
                  value: String(a.id),
                  label: a.name || a.identifier,
                  image: a.image,
                }))}
                searchPlaceholder="Tier suchen…"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>{t("form.reward_variant")}</Label>
              <SearchableSelect
                value={rewardSpecialCoatId}
                onChange={setRewardSpecialCoatId}
                options={allVariants}
                searchPlaceholder="Variante suchen…"
              />
            </FieldGroup>

            <FieldGroup>
              <Label>{t("form.stars")}</Label>
              <Select value={stars} onChange={(e) => setStars(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </FieldGroup>
          </Fields>
        </InfoAccordion>

        {/* Übersetzungen */}
        <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
          <DynamicRowInput
            rows={texts.map((tx) => ({ id: tx.languageCode, ...tx }))}
            columns={[
              {
                key: "languageCode",
                label: t("form.type"),
                type: "select",
                $flex: 0.5,
                options: languageOptions,
              },
              {
                key: "name",
                label: t("form.create_title"),
                type: "text",
                $flex: 1,
                placeholder: "Name",
              },
            ]}
            onAdd={onAddText}
            onRemove={onRemoveText}
            onChange={onChangeText}
            disabledAdd={allLanguagesUsed}
          />
        </InfoAccordion>

        {/* Anforderungen */}
        <InfoAccordion
          title={t("form.requirements")}
          icon="/images/icons/buildings.png"
          defaultOpen
        >
          <DynamicRowInput
            rows={requirements}
            columns={[
              {
                key: "type",
                label: t("form.type"),
                type: "select",
                $flex: 0.6,
                allowDuplicates: true,
                options: [
                  { value: "ANIMAL", label: t("form.animal") },
                  { value: "STATUE", label: t("form.statue") },
                ],
              },
              {
                key: "itemId",
                label: t("form.animal"),
                type: "select",
                $flex: 1.5,
                allowDuplicates: true,
                getOptions: (row) => [
                  { value: "", label: "—" },
                  ...(row.type === "STATUE" ? statueOptions : animalOptions),
                ],
              },
              {
                key: "requiredLevel",
                label: t("form.level"),
                type: "number",
                $flex: 0.5,
                placeholder: t("form.level"),
              },
            ]}
            onAdd={onAddRequirement}
            onRemove={onRemoveRequirement}
            onChange={onChangeRequirement}
          />
        </InfoAccordion>
      </CardsColumn>

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : t("form.save")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

const CardsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px 20px;
  width: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;


const Select = styled.select`
  padding: 7px 10px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  outline: none;
  &:focus {
    border-color: #7aad33;
  }
`;
