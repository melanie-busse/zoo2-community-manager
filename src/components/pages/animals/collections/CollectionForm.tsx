"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import SubmitButton from "@/components/ui/form/SubmitButton";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import { createCollectionOnClient, updateCollectionOnClient } from "@/service/frontend/Collection";
import { SUPPORTED_LANGUAGES, FLAG_MAP } from "@/constants/languages";
import type { RawCollection } from "@/types/collection";

interface CollectionFormProps {
  collection?: RawCollection;
  allAnimals: { id: number; identifier: string; name: string }[];
  allStatues: { id: number; animalName: string; contestName: string }[];
  allRegions: { id: number; identifier: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}

interface TextRow {
  languageCode: string;
  name: string;
}

interface RequirementRow {
  id: number;
  type: "ANIMAL" | "STATUE";
  animalId: string;
  statueId: string;
  requiredLevel: string;
}

export default function CollectionForm({
  collection,
  allAnimals,
  allStatues,
  allRegions,
  onClose,
  onSaved,
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
  const [rewardVariant, setRewardVariant] = useState<string>(collection?.rewardVariant ?? "");
  const [stars, setStars] = useState<string>(collection?.stars != null ? String(collection.stars) : "1");

  const [texts, setTexts] = useState<TextRow[]>(
    collection?.texts.map((t) => ({ languageCode: t.languageCode, name: t.name })) ?? [],
  );

  const [requirements, setRequirements] = useState<RequirementRow[]>(
    collection?.requirements.map((r, i) => ({
      id: i,
      type: r.type,
      animalId: r.animalId != null ? String(r.animalId) : "",
      statueId: r.statueId != null ? String(r.statueId) : "",
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
  const onAddRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      { id: Date.now(), type: "ANIMAL", animalId: "", statueId: "", requiredLevel: "" },
    ]);
  };
  const onRemoveRequirement = (rowId: number) =>
    setRequirements((prev) => prev.filter((r) => r.id !== rowId));
  const onChangeRequirement = (rowId: number, key: string, value: string) =>
    setRequirements((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [key]: value } : r)),
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
      rewardVariant: rewardVariant.trim() || null,
      stars: parseInt(stars) || 1,
      texts: texts.filter((tx) => tx.name.trim()),
      requirements: requirements.map((r, i) => ({
        type: r.type,
        animalId: r.type === "ANIMAL" && r.animalId !== "" ? parseInt(r.animalId) : null,
        statueId: r.type === "STATUE" && r.statueId !== "" ? parseInt(r.statueId) : null,
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
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <PanelHeader>
          <PanelTitle>{collection ? t("form.edit_title") : t("form.create_title")}</PanelTitle>
          <CloseButton type="button" onClick={onClose}>✕</CloseButton>
        </PanelHeader>

        <form onSubmit={handleSubmit}>
          <CardsColumn>
            {/* Kopfdaten */}
            <InfoAccordion title={t("form.region")} icon="/images/icons/buildings.png" defaultOpen>
              <Fields>
                <FieldGroup>
                  <Label>{t("form.region")}</Label>
                  <Select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
                    <option value="">—</option>
                    {allRegions.map((r) => (
                      <option key={r.id} value={r.id}>{r.name || r.identifier}</option>
                    ))}
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <Label>{t("form.reward_animal")}</Label>
                  <Select value={rewardAnimalId} onChange={(e) => setRewardAnimalId(e.target.value)}>
                    <option value="">—</option>
                    {allAnimals.map((a) => (
                      <option key={a.id} value={a.id}>{a.name || a.identifier}</option>
                    ))}
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <Label>{t("form.reward_variant")}</Label>
                  <Input
                    type="text"
                    value={rewardVariant}
                    onChange={(e) => setRewardVariant(e.target.value)}
                    placeholder={t("form.reward_variant")}
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
                  { key: "languageCode", label: t("form.type"), type: "select", $flex: 0.5, options: languageOptions },
                  { key: "name", label: t("form.create_title"), type: "text", $flex: 1, placeholder: "Name" },
                ]}
                onAdd={onAddText}
                onRemove={onRemoveText}
                onChange={onChangeText}
                disabledAdd={allLanguagesUsed}
              />
            </InfoAccordion>

            {/* Anforderungen */}
            <InfoAccordion title={t("form.requirements")} icon="/images/icons/buildings.png" defaultOpen>
              <RequirementsTable>
                {requirements.length === 0 && (
                  <EmptyRequirements>{t("form.requirements")}: —</EmptyRequirements>
                )}
                {requirements.map((req) => (
                  <RequirementRow key={req.id}>
                    <ReqSelect
                      value={req.type}
                      onChange={(e) => onChangeRequirement(req.id, "type", e.target.value as "ANIMAL" | "STATUE")}
                    >
                      <option value="ANIMAL">{t("form.animal")}</option>
                      <option value="STATUE">{t("form.statue")}</option>
                    </ReqSelect>

                    {req.type === "ANIMAL" ? (
                      <ReqSelect
                        value={req.animalId}
                        onChange={(e) => onChangeRequirement(req.id, "animalId", e.target.value)}
                      >
                        <option value="">—</option>
                        {allAnimals.map((a) => (
                          <option key={a.id} value={a.id}>{a.name || a.identifier}</option>
                        ))}
                      </ReqSelect>
                    ) : (
                      <ReqSelect
                        value={req.statueId}
                        onChange={(e) => onChangeRequirement(req.id, "statueId", e.target.value)}
                      >
                        <option value="">—</option>
                        {allStatues.map((s) => (
                          <option key={s.id} value={s.id}>{s.animalName} ({s.contestName})</option>
                        ))}
                      </ReqSelect>
                    )}

                    <ReqInput
                      type="number"
                      value={req.requiredLevel}
                      onChange={(e) => onChangeRequirement(req.id, "requiredLevel", e.target.value)}
                      placeholder={t("form.level")}
                      min={0}
                    />

                    <RemoveBtn type="button" onClick={() => onRemoveRequirement(req.id)}>✕</RemoveBtn>
                  </RequirementRow>
                ))}
                <AddReqButton type="button" onClick={onAddRequirement}>
                  + {t("form.requirements")}
                </AddReqButton>
              </RequirementsTable>
            </InfoAccordion>
          </CardsColumn>

          <SubmitButton
            label={isSubmitting ? tCommon("saving") : t("form.save")}
            isSubmitting={isSubmitting}
          />
        </form>
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PanelTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  &:hover { color: #333; }
`;

const CardsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 20px;
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

const Input = styled.input`
  padding: 7px 10px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  &:focus { border-color: #7aad33; }
`;

const Select = styled.select`
  padding: 7px 10px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  outline: none;
  &:focus { border-color: #7aad33; }
`;

const RequirementsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyRequirements = styled.p`
  font-size: 0.85rem;
  color: #aaa;
  margin: 0;
`;

const RequirementRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ReqSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
  outline: none;
  flex: 1;
  &:focus { border-color: #7aad33; }
`;

const ReqInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  width: 80px;
  &:focus { border-color: #7aad33; }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #e05c5c;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 6px;
  &:hover { color: #c0392b; }
`;

const AddReqButton = styled.button`
  align-self: flex-start;
  padding: 6px 14px;
  background: #f0f7e6;
  border: 1px solid #7aad33;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #4a7a1a;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: #e0f0cc; }
`;
