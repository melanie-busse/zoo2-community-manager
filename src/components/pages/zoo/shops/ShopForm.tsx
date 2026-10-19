"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import SubmitButton from "@/components/ui/form/SubmitButton";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import { createShopOnClient, updateShopOnClient } from "@/service/frontend/Shop";

interface ShopLevel {
  level: number;
  cost: string;
  currency: string;
  maxCapacity: string;
  buildTime: string;
}

interface Region {
  id: number;
  identifier: string;
}

interface ShopFormProps {
  shop?: {
    id: number;
    name: string;
    coinsPerClient: number | null;
    regionId: number | null;
    levels: { level: number; cost: number; currency: string; maxCapacity: number; buildTime: string }[];
  };
  regions: Region[];
}

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

export default function ShopForm({ shop, regions }: ShopFormProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [name, setName] = useState(shop?.name ?? "");
  const [coinsPerClient, setCoinsPerClient] = useState(
    shop?.coinsPerClient != null ? String(shop.coinsPerClient) : "",
  );
  const [regionId, setRegionId] = useState<string>(
    shop?.regionId != null ? String(shop.regionId) : "",
  );
  const [levels, setLevels] = useState<ShopLevel[]>(() => {
    if (shop && shop.levels.length > 0) {
      return shop.levels.map((l) => ({
        level: l.level,
        cost: String(l.cost),
        currency: l.currency,
        maxCapacity: String(l.maxCapacity),
        buildTime: l.buildTime,
      }));
    }
    return [{ level: 0, cost: "", currency: "COINS", maxCapacity: "", buildTime: "" }];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLevel = () => {
    setLevels((prev) => [
      ...prev,
      { level: prev.length, cost: "", currency: "COINS", maxCapacity: "", buildTime: "" },
    ]);
  };

  const removeLevel = (idx: number) => {
    setLevels((prev) => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, level: i })));
  };

  const updateLevel = (idx: number, field: keyof ShopLevel, value: string) => {
    setLevels((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      toast.warn(t("form.messages.requiredName"));
      return;
    }

    const payload = {
      name: name.trim(),
      coinsPerClient: coinsPerClient !== "" ? parseInt(coinsPerClient) : null,
      regionId: regionId !== "" ? parseInt(regionId) : null,
      levels: levels.map((l) => ({
        level: l.level,
        cost: parseInt(l.cost) || 0,
        currency: l.currency,
        maxCapacity: parseInt(l.maxCapacity) || 0,
        buildTime: l.buildTime,
      })),
    };

    setIsSubmitting(true);
    try {
      if (shop) {
        await updateShopOnClient(shop.id, payload);
        toast.success(t("form.messages.editSuccess"));
        router.push("/zoo/shops");
      } else {
        await createShopOnClient(payload);
        toast.success(t("form.messages.createSuccess"));
        router.push("/zoo/shops");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <Column>
          <InfoAccordion title={t("form.basic_info")} icon="/images/icons/buildings.png" defaultOpen>
            <Fields>
              <FieldGroup>
                <Label>{t("name")}</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus={!shop}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>{t("coins_per_client")}</Label>
                <Input
                  type="number"
                  value={coinsPerClient}
                  onChange={(e) => setCoinsPerClient(e.target.value)}
                  min={0}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>{t("region")}</Label>
                <Select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
                  <option value="">{t("unassigned")}</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.identifier}</option>
                  ))}
                </Select>
              </FieldGroup>
            </Fields>
          </InfoAccordion>
        </Column>

        <Column>
          <InfoAccordion title={t("form.levels_section")} icon="/images/icons/buildings.png" defaultOpen>
            <LevelSection>
              {levels.map((l, idx) => (
                <LevelRow key={idx}>
                  <LevelNum>Lvl {l.level}</LevelNum>
                  <Input
                    type="number"
                    placeholder={t("build_cost")}
                    value={l.cost}
                    onChange={(e) => updateLevel(idx, "cost", e.target.value)}
                    min={0}
                    style={{ flex: 1 }}
                  />
                  <CurrencySelect
                    value={l.currency}
                    onChange={(e) => updateLevel(idx, "currency", e.target.value)}
                  >
                    <option value="COINS">{tCommon("currencies.zoodollar")}</option>
                    <option value="DIAMONDS">{tCommon("currencies.diamonds")}</option>
                  </CurrencySelect>
                  <Input
                    type="number"
                    placeholder={t("max_capacity")}
                    value={l.maxCapacity}
                    onChange={(e) => updateLevel(idx, "maxCapacity", e.target.value)}
                    min={0}
                    style={{ flex: 1 }}
                  />
                  <Input
                    type="text"
                    placeholder={t("build_time")}
                    value={l.buildTime}
                    onChange={(e) => updateLevel(idx, "buildTime", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {levels.length > 1 && (
                    <RemoveBtn type="button" onClick={() => removeLevel(idx)}>×</RemoveBtn>
                  )}
                </LevelRow>
              ))}
              <AddLevelBtn type="button" onClick={addLevel}>+ Level</AddLevelBtn>
            </LevelSection>
          </InfoAccordion>
        </Column>
      </FormGrid>

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : t("form.save_shop")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

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

  &:focus {
    border-color: #7aad33;
  }
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

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LevelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const LevelNum = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #5d7a2a;
  white-space: nowrap;
  min-width: 36px;
`;

const CurrencySelect = styled.select`
  padding: 7px 6px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
`;

const RemoveBtn = styled.button`
  padding: 4px 8px;
  border: 1px solid #e05252;
  background: transparent;
  color: #e05252;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #fdeaea;
  }
`;

const AddLevelBtn = styled.button`
  align-self: flex-start;
  padding: 5px 12px;
  border: 1px dashed #aac46a;
  background: transparent;
  color: #5d7a2a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;

  &:hover {
    background: #f0f7e0;
  }
`;
