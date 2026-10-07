"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { createBiomeOnClient, updateBiomeOnClient } from "@/service/frontend/Biome";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import Label from "@/components/ui/form/Label";
import SubmitButton from "@/components/ui/form/SubmitButton";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import FormRow from "@/components/ui/form/styling/FormRow";

interface Language {
  code: string;
  name: string;
}

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface BiomeFormProps {
  biome?: {
    id: number;
    identifier: string;
    price: number | null;
    priceTypeId: number | null;
    expansionsCost: number | null;
    priceTypeExpansionsCostId: number | null;
    size: number | null;
    regionId: number | null;
    biomestext: { languageCode: string; biomeName: string; biomeDescription: string | null }[];
  };
  languages: Language[];
  regions: Region[];
}

type BiomeText = { languageCode: string; biomeName: string; biomeDescription: string };

export default function BiomeForm({ biome, languages, regions }: BiomeFormProps) {
  const t = useTranslations("biome");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [identifier, setIdentifier] = useState(biome?.identifier ?? "");
  const [price, setPrice] = useState(biome?.price?.toString() ?? "");
  const [priceTypeId, setPriceTypeId] = useState(biome?.priceTypeId?.toString() ?? "1");
  const [expansionsCost, setExpansionsCost] = useState(biome?.expansionsCost?.toString() ?? "");
  const [priceTypeExpansionsCostId, setPriceTypeExpansionsCostId] = useState(
    biome?.priceTypeExpansionsCostId?.toString() ?? "1",
  );
  const [size, setSize] = useState(biome?.size?.toString() ?? "");
  const [regionId, setRegionId] = useState(biome?.regionId?.toString() ?? "0");
  const [biomestext, setBiomestext] = useState<BiomeText[]>(() => {
    const textMap = new Map(
      biome?.biomestext.map((bt) => [bt.languageCode, bt]) ?? [],
    );
    return languages.map((l) => ({
      languageCode: l.code,
      biomeName: textMap.get(l.code)?.biomeName ?? "",
      biomeDescription: textMap.get(l.code)?.biomeDescription ?? "",
    }));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const regionOptions = [
    { value: "0", label: "-" },
    ...regions.map((r) => ({
      value: String(r.id),
      label: r.regionTexts[0]?.name ?? r.identifier,
    })),
  ];

  const updateText = (code: string, field: keyof Omit<BiomeText, "languageCode">, value: string) => {
    setBiomestext((prev) =>
      prev.map((bt) => (bt.languageCode === code ? { ...bt, [field]: value } : bt)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!identifier.trim()) {
      toast.warn(t("form.messages.requiredIdentifier"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        identifier,
        price: price !== "" ? parseInt(price, 10) : null,
        priceTypeId: price !== "" ? parseInt(priceTypeId, 10) : null,
        expansionsCost: expansionsCost !== "" ? parseInt(expansionsCost, 10) : null,
        priceTypeExpansionsCostId: expansionsCost !== "" ? parseInt(priceTypeExpansionsCostId, 10) : null,
        size: size !== "" ? parseInt(size, 10) : null,
        regionId: regionId !== "0" ? parseInt(regionId, 10) : null,
        biomestext,
      };

      if (biome?.id) {
        await updateBiomeOnClient(biome.id, data);
      } else {
        await createBiomeOnClient(data);
      }
      toast.success(biome?.id ? t("form.messages.editSuccess") : t("form.messages.createSuccess"));
      router.push("/zoo/biomes");
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
          <InfoAccordion title={t("form.basic_info")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              <FormGroup>
                <Label htmlFor="identifier">{t("identifier")}</Label>
                <InputField
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="price">{t("price")}</Label>
                <FormRow>
                  <InputField
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <Selectbox
                    id="priceTypeId"
                    name="priceTypeId"
                    value={priceTypeId}
                    onChange={(e) => setPriceTypeId(e.target.value)}
                    options={currencyOptions}
                  />
                </FormRow>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="expansionsCost">{t("expansion_cost")}</Label>
                <FormRow>
                  <InputField
                    id="expansionsCost"
                    type="number"
                    value={expansionsCost}
                    onChange={(e) => setExpansionsCost(e.target.value)}
                  />
                  <Selectbox
                    id="priceTypeExpansionsCostId"
                    name="priceTypeExpansionsCostId"
                    value={priceTypeExpansionsCostId}
                    onChange={(e) => setPriceTypeExpansionsCostId(e.target.value)}
                    options={currencyOptions}
                  />
                </FormRow>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="size">{t("size")}</Label>
                <InputField
                  id="size"
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="regionId">{t("region")}</Label>
                <Selectbox
                  id="regionId"
                  name="regionId"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  options={regionOptions}
                />
              </FormGroup>
            </SectionColumn>
          </InfoAccordion>
        </Column>

        <Column>
          <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              {biomestext.map((bt) => {
                const lang = languages.find((l) => l.code === bt.languageCode);
                return (
                  <FormGroup key={bt.languageCode}>
                    <Label>{lang?.name ?? bt.languageCode}</Label>
                    <InputField
                      id={`biomeName-${bt.languageCode}`}
                      type="text"
                      placeholder={t("form.biome_name")}
                      value={bt.biomeName}
                      onChange={(e) => updateText(bt.languageCode, "biomeName", e.target.value)}
                    />
                    <InputField
                      id={`biomeDescription-${bt.languageCode}`}
                      type="text"
                      placeholder={t("form.biome_description")}
                      value={bt.biomeDescription}
                      onChange={(e) => updateText(bt.languageCode, "biomeDescription", e.target.value)}
                    />
                  </FormGroup>
                );
              })}
            </SectionColumn>
          </InfoAccordion>
        </Column>
      </FormGrid>

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : t("form.save_biome")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
