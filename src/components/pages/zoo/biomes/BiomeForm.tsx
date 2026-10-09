"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { createBiomeOnClient, updateBiomeOnClient } from "@/service/frontend/Biome";
import { FLAG_MAP } from "@/constants/languages";
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
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";

interface Language {
  code: string;
  name: string;
}

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

type BiomeText  = { languageCode: string; biomeName: string; biomeDescription: string };
type ShelterRow = { id: number | string; level: string; cost: string; pricetype: string; buildTime: string; unlockLevel: string };
type GameRow    = { id: number | string; identifier: string; price: string; pricetype: string; repair: string; repairpricetype: string; [key: string]: string | number };

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
    troughs: { id: number; price: number; pricetype: number }[];
    waterHoles: { id: number; price: number; pricetype: number; repair: number }[];
    shelters: { id: number; level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null }[];
    games: { id: number; identifier: string; price: number; pricetype: number; repair: number; repairpricetype: number; texts: { languageCode: string; name: string }[] }[];
  };
  languages: Language[];
  regions: Region[];
}

function makeHandlers<T extends { id: number | string }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  emptyRow: Omit<T, "id">,
) {
  return {
    onAdd: () => setter((p) => [...p, { id: Date.now(), ...emptyRow } as T]),
    onRemove: (id: number | string) => setter((p) => p.filter((r) => r.id !== id)),
    onChange: (id: number | string, key: string, val: string) =>
      setter((p) => p.map((r) => (r.id === id ? { ...r, [key]: val } : r))),
  };
}

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

  const [biomestext, setBiomestext] = useState<BiomeText[]>(
    () => (biome?.biomestext ?? []).map((bt) => ({
      languageCode: bt.languageCode,
      biomeName: bt.biomeName ?? "",
      biomeDescription: bt.biomeDescription ?? "",
    }))
  );

  // Trog — single entry
  const firstTrough = biome?.troughs?.[0];
  const [troughPrice, setTroughPrice] = useState(firstTrough?.price?.toString() ?? "");
  const [troughPricetype, setTroughPricetype] = useState(firstTrough?.pricetype?.toString() ?? "1");

  // Wasserstelle — single entry
  const firstWater = biome?.waterHoles?.[0];
  const [waterPrice, setWaterPrice] = useState(firstWater?.price?.toString() ?? "");
  const [waterPricetype, setWaterPricetype] = useState(firstWater?.pricetype?.toString() ?? "1");
  const [waterRepair, setWaterRepair] = useState(firstWater?.repair?.toString() ?? "");

  const [shelters, setShelters] = useState<ShelterRow[]>(() =>
    (biome?.shelters ?? []).map((r) => ({ id: r.id, level: String(r.level), cost: String(r.cost), pricetype: String(r.pricetype), buildTime: String(r.buildTime ?? ""), unlockLevel: String(r.unlockLevel ?? "") }))
  );

  const [games, setGames] = useState<GameRow[]>(() =>
    (biome?.games ?? []).map((r) => {
      const textMap = new Map(r.texts.map((t) => [t.languageCode, t.name]));
      const textCols = Object.fromEntries(languages.map((l) => [`text_${l.code}`, textMap.get(l.code) ?? ""]));
      return { id: r.id, identifier: r.identifier, price: String(r.price), pricetype: String(r.pricetype), repair: String(r.repair), repairpricetype: String(r.repairpricetype), ...textCols };
    })
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];
  const regionOptions = [
    { value: "0", label: "-" },
    ...regions.map((r) => ({ value: String(r.id), label: r.regionTexts[0]?.name ?? r.identifier })),
  ];

  const languageOptions = languages.map((l) => ({
    value: l.code,
    label: l.name,
    icon: FLAG_MAP[l.code] || "fi-un",
  }));
  const allLanguagesUsed = languageOptions.length > 0 && biomestext.length >= languageOptions.length;

  const onAddText = () => {
    const usedCodes = biomestext.map((bt) => bt.languageCode);
    const next = languageOptions.find((opt) => !usedCodes.includes(opt.value));
    if (next) {
      setBiomestext((prev) => [...prev, { languageCode: next.value, biomeName: "", biomeDescription: "" }]);
    }
  };
  const onRemoveText = (id: number | string) =>
    setBiomestext((prev) => prev.filter((bt) => bt.languageCode !== id));
  const onChangeText = (id: number | string, field: string, val: string) =>
    setBiomestext((prev) => prev.map((bt) => (bt.languageCode === id ? { ...bt, [field]: val } : bt)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!identifier.trim()) {
      toast.warn(t("form.messages.requiredIdentifier"));
      return;
    }
    setIsSubmitting(true);
    try {
      const troughs = troughPrice !== ""
        ? [{ price: parseInt(troughPrice) || 0, pricetype: parseInt(troughPricetype) || 1 }]
        : [];
      const waterHoles = waterPrice !== ""
        ? [{ price: parseInt(waterPrice) || 0, pricetype: parseInt(waterPricetype) || 1, repair: parseInt(waterRepair) || 0 }]
        : [];
      const shelterData = shelters.map((r) => ({ level: parseInt(r.level) || 0, cost: parseInt(r.cost) || 0, pricetype: parseInt(r.pricetype) || 1, buildTime: r.buildTime !== "" ? parseInt(r.buildTime) || null : null, unlockLevel: r.unlockLevel !== "" ? parseInt(r.unlockLevel) || null : null }));

      const data = {
        identifier,
        price: price !== "" ? parseInt(price, 10) : null,
        priceTypeId: price !== "" ? parseInt(priceTypeId, 10) : null,
        expansionsCost: expansionsCost !== "" ? parseInt(expansionsCost, 10) : null,
        priceTypeExpansionsCostId: expansionsCost !== "" ? parseInt(priceTypeExpansionsCostId, 10) : null,
        size: size !== "" ? parseInt(size, 10) : null,
        regionId: regionId !== "0" ? parseInt(regionId, 10) : null,
        biomestext,
        troughs,
        waterHoles,
        shelters: shelterData,
        games: games.map((r) => ({ identifier: r.identifier, price: parseInt(r.price) || 0, pricetype: parseInt(r.pricetype) || 1, repair: parseInt(r.repair) || 0, repairpricetype: parseInt(r.repairpricetype) || 1, texts: languages.map((l) => ({ languageCode: l.code, name: r[`text_${l.code}`] ?? "" })) })),
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

  const gameColumns = [
    { key: "identifier",      label: t("identifier"),        type: "text" as const, $flex: 2 },
    { key: "price",           label: t("price"),             type: "number" as const },
    { key: "pricetype",       label: t("price_type"),        type: "select" as const, options: currencyOptions },
    { key: "repair",          label: t("repair"),            type: "number" as const },
    { key: "repairpricetype", label: t("repair_price_type"), type: "select" as const, options: currencyOptions },
    ...languages.map((l) => ({ key: `text_${l.code}`, label: l.name, type: "text" as const })),
  ];

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <Column>
          <InfoAccordion title={t("form.basic_info")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              <FormGroup>
                <Label htmlFor="identifier">{t("identifier")}</Label>
                <InputField id="identifier" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="price">{t("price")}</Label>
                <FormRow>
                  <InputField id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <Selectbox id="priceTypeId" name="priceTypeId" value={priceTypeId} onChange={(e) => setPriceTypeId(e.target.value)} options={currencyOptions} />
                </FormRow>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="expansionsCost">{t("expansion_cost")}</Label>
                <FormRow>
                  <InputField id="expansionsCost" type="number" value={expansionsCost} onChange={(e) => setExpansionsCost(e.target.value)} />
                  <Selectbox id="priceTypeExpansionsCostId" name="priceTypeExpansionsCostId" value={priceTypeExpansionsCostId} onChange={(e) => setPriceTypeExpansionsCostId(e.target.value)} options={currencyOptions} />
                </FormRow>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="size">{t("size")}</Label>
                <InputField id="size" type="number" value={size} onChange={(e) => setSize(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="regionId">{t("region")}</Label>
                <Selectbox id="regionId" name="regionId" value={regionId} onChange={(e) => setRegionId(e.target.value)} options={regionOptions} />
              </FormGroup>
            </SectionColumn>
          </InfoAccordion>

        </Column>

        <Column>
          <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              <DynamicRowInput
                rows={biomestext.map((bt) => ({ id: bt.languageCode, languageCode: bt.languageCode, biomeName: bt.biomeName }))}
                columns={[
                  { key: "languageCode", label: t("form.language"), type: "select", $flex: 0.5, options: languageOptions },
                  { key: "biomeName",    label: t("form.biome_name"), type: "text", $flex: 1, placeholder: t("form.biome_name") },
                ]}
                onAdd={onAddText}
                onRemove={onRemoveText}
                onChange={onChangeText}
                disabledAdd={allLanguagesUsed}
              />
            </SectionColumn>
          </InfoAccordion>
        </Column>

        <Column>
          <InfoAccordion title={t("form.water_holes")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              <FormGroup>
                <Label htmlFor="waterPrice">{t("price")}</Label>
                <FormRow>
                  <InputField id="waterPrice" type="number" value={waterPrice} onChange={(e) => setWaterPrice(e.target.value)} />
                  <Selectbox id="waterPricetype" name="waterPricetype" value={waterPricetype} onChange={(e) => setWaterPricetype(e.target.value)} options={currencyOptions} />
                </FormRow>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="waterRepair">{t("repair")}</Label>
                <InputField id="waterRepair" type="number" value={waterRepair} onChange={(e) => setWaterRepair(e.target.value)} />
              </FormGroup>
            </SectionColumn>
          </InfoAccordion>
        </Column>

        <Column>
          <InfoAccordion title={t("form.troughs")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              <FormGroup>
                <Label htmlFor="troughPrice">{t("price")}</Label>
                <FormRow>
                  <InputField id="troughPrice" type="number" value={troughPrice} onChange={(e) => setTroughPrice(e.target.value)} />
                  <Selectbox id="troughPricetype" name="troughPricetype" value={troughPricetype} onChange={(e) => setTroughPricetype(e.target.value)} options={currencyOptions} />
                </FormRow>
              </FormGroup>
            </SectionColumn>
          </InfoAccordion>
        </Column>

        <Column $fullWidth>
          <InfoAccordion title={t("shelter_levels")} icon="/images/icons/info.png" defaultOpen>
            <DynamicRowInput
              rows={shelters}
              columns={[
                { key: "level",       label: t("level"),        type: "number" as const },
                { key: "cost",        label: t("build_cost"),   type: "number" as const, $flex: 2 },
                { key: "pricetype",   label: t("price_type"),   type: "select" as const, options: currencyOptions },
                { key: "buildTime",   label: t("upgrade_time"), type: "number" as const },
                { key: "unlockLevel", label: t("unlock_level"), type: "number" as const },
              ]}
              hideAdd
              {...makeHandlers(setShelters, { level: "", cost: "", pricetype: "1", buildTime: "", unlockLevel: "" })}
            />
          </InfoAccordion>
        </Column>

        <Column>
          <InfoAccordion title={t("games")} icon="/images/icons/play.png" defaultOpen>
            <DynamicRowInput
              rows={games}
              columns={gameColumns}
              {...makeHandlers(setGames, { identifier: "", price: "", pricetype: "1", repair: "", repairpricetype: "1", ...Object.fromEntries(languages.map((l) => [`text_${l.code}`, ""])) })}
            />
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
