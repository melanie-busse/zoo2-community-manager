"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import SubmitButton from "@/components/ui/form/SubmitButton";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import { createShopOnClient, updateShopOnClient } from "@/service/frontend/Shop";
import { SUPPORTED_LANGUAGES, FLAG_MAP } from "@/constants/languages";

interface ShopLevel {
  level: number;
  cost: string;
  currency: string;
  maxCapacity: string;
  buildTime: string;
}

interface ShopText {
  languageCode: string;
  name: string;
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
  texts?: { languageCode: string; name: string }[];
}

export default function ShopForm({ shop, regions, texts: initialTexts = [] }: ShopFormProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const router = useRouter();

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

  const [texts, setTexts] = useState<ShopText[]>(
    initialTexts.map((t) => ({ languageCode: t.languageCode, name: t.name })),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setTexts((prev) =>
      prev.map((t) => (t.languageCode === id ? { ...t, [key]: value } : t)),
    );

  const currencyOptions = [
    { value: "COINS", label: tCommon("currencies.zoodollar") },
    { value: "DIAMONDS", label: tCommon("currencies.diamonds") },
  ];

  const onAddLevel = () => {
    setLevels((prev) => [
      ...prev,
      { level: prev.length, cost: "", currency: "COINS", maxCapacity: "", buildTime: "" },
    ]);
  };

  const onRemoveLevel = (id: number | string) => {
    setLevels((prev) =>
      prev.filter((l) => l.level !== Number(id)).map((l, i) => ({ ...l, level: i })),
    );
  };

  const onChangeLevel = (id: number | string, key: string, value: string) => {
    setLevels((prev) => prev.map((l) => (l.level === Number(id) ? { ...l, [key]: value } : l)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const enText = texts.find((tx) => tx.languageCode === "en")?.name?.trim();
    const deName = texts.find((tx) => tx.languageCode === "de")?.name?.trim();
    const fallbackName = enText || deName || texts.find((tx) => tx.name.trim())?.name?.trim();
    if (!fallbackName) {
      toast.warn(t("form.messages.requiredName"));
      return;
    }

    const payload = {
      name: fallbackName,
      coinsPerClient: coinsPerClient !== "" ? parseInt(coinsPerClient) : null,
      regionId: regionId !== "" ? parseInt(regionId) : null,
      levels: levels.map((l) => ({
        level: l.level,
        cost: parseInt(l.cost) || 0,
        currency: l.currency,
        maxCapacity: parseInt(l.maxCapacity) || 0,
        buildTime: l.buildTime,
      })),
      texts: texts.filter((t) => t.name.trim()),
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
      <CardsColumn>
        {/* Stammdaten */}
        <InfoAccordion title={t("form.basic_info")} icon="/images/icons/buildings.png" defaultOpen>
          <Fields>
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

        {/* Übersetzungen */}
        <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
          <DynamicRowInput
            rows={texts.map((tx) => ({ id: tx.languageCode, ...tx }))}
            columns={[
              { key: "languageCode", label: t("form.language"), type: "select", $flex: 0.5, options: languageOptions },
              { key: "name", label: t("name"), type: "text", $flex: 1, placeholder: t("name") },
            ]}
            onAdd={onAddText}
            onRemove={onRemoveText}
            onChange={onChangeText}
            disabledAdd={allLanguagesUsed}
          />
        </InfoAccordion>

        {/* Level-Stufen */}
        <InfoAccordion title={t("form.levels_section")} icon="/images/icons/buildings.png" defaultOpen>
          <DynamicRowInput
            rows={levels.map((l) => ({ id: l.level, ...l }))}
            columns={[
              { key: "cost", label: t("build_cost"), type: "number", $flex: 1, placeholder: t("build_cost") },
              { key: "currency", label: tCommon("currencies.zoodollar") + "/" + tCommon("currencies.diamonds"), type: "select", $flex: 0.8, options: currencyOptions, allowDuplicates: true },
              { key: "maxCapacity", label: t("max_capacity"), type: "number", $flex: 1, placeholder: t("max_capacity") },
              { key: "buildTime", label: t("build_time"), type: "text", $flex: 1, placeholder: t("build_time") },
            ]}
            onAdd={onAddLevel}
            onRemove={onRemoveLevel}
            onChange={onChangeLevel}
          />
        </InfoAccordion>
      </CardsColumn>

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : t("form.save_shop")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

const CardsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
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

