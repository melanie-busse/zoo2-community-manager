"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import styled from "styled-components";
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
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";

interface Language {
  code: string;
  name: string;
}

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

type BiomeText    = { languageCode: string; biomeName: string; biomeDescription: string };
type ShelterLevel = { cost: string; pricetype: string; buildTime: string; unlockLevel: string };

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
    waterHoles: { id: number; price: number; pricetype: number; repair: number; repairpricetype: number }[];
    shelters: { id: number; level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null }[];
    games: { id: number }[];
  };
  languages: Language[];
  regions: Region[];
  allGames: { id: number; identifier: string; biomeIdentifier: string; texts: { name: string }[] }[];
}


export default function BiomeForm({ biome, languages, regions, allGames }: BiomeFormProps) {
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
  const [waterRepairpricetype, setWaterRepairpricetype] = useState(firstWater?.repairpricetype?.toString() ?? "1");

  const [shelters, setShelters] = useState<ShelterLevel[]>(() => {
    const map = new Map((biome?.shelters ?? []).map((r) => [r.level, r]));
    return [0, 1, 2, 3].map((lvl) => {
      const r = map.get(lvl);
      return { cost: String(r?.cost ?? ""), pricetype: String(r?.pricetype ?? "1"), buildTime: String(r?.buildTime ?? ""), unlockLevel: String(r?.unlockLevel ?? "") };
    });
  });

  const updateShelter = (level: number, field: keyof ShelterLevel, val: string) =>
    setShelters((prev) => prev.map((s, i) => (i === level ? { ...s, [field]: val } : s)));

  const [gameIds, setGameIds] = useState<number[]>(
    () => (biome?.games ?? []).map((g) => g.id)
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
        ? [{ price: parseInt(waterPrice) || 0, pricetype: parseInt(waterPricetype) || 1, repair: parseInt(waterRepair) || 0, repairpricetype: parseInt(waterRepairpricetype) || 1 }]
        : [];
      const shelterData = shelters
        .map((r, lvl) => ({ level: lvl, cost: parseInt(r.cost) || 0, pricetype: parseInt(r.pricetype) || 1, buildTime: r.buildTime !== "" ? parseInt(r.buildTime) || null : null, unlockLevel: r.unlockLevel !== "" ? parseInt(r.unlockLevel) || null : null }))
        .filter((r) => r.cost > 0);

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
        gameIds,
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

  const gameItems = allGames.map((g) => ({
    id: g.id,
    name: g.texts[0]?.name ?? g.identifier,
    imagePath: g.biomeIdentifier ? `/images/biomes/${g.biomeIdentifier}/game/${g.identifier}/image.webp` : undefined,
  }));

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
                <FormRow>
                  <InputField id="waterRepair" type="number" value={waterRepair} onChange={(e) => setWaterRepair(e.target.value)} />
                  <Selectbox id="waterRepairpricetype" name="waterRepairpricetype" value={waterRepairpricetype} onChange={(e) => setWaterRepairpricetype(e.target.value)} options={currencyOptions} />
                </FormRow>
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
            <ShelterTable>
              <thead>
                <tr>
                  <ShelterTh>{t("level")}</ShelterTh>
                  <ShelterTh>{t("build_cost")}</ShelterTh>
                  <ShelterTh>{t("price_type")}</ShelterTh>
                  <ShelterTh>{t("upgrade_time")}</ShelterTh>
                  <ShelterTh>{t("unlock_level")}</ShelterTh>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3].map((lvl) => (
                  <tr key={lvl}>
                    <ShelterTd><LevelLabel>{t("level_value", { level: lvl })}</LevelLabel></ShelterTd>
                    <ShelterTd>
                      <InputField id={`shelter-cost-${lvl}`} type="number" value={shelters[lvl].cost} onChange={(e) => updateShelter(lvl, "cost", e.target.value)} />
                    </ShelterTd>
                    <ShelterTd>
                      <Selectbox id={`shelter-pricetype-${lvl}`} name={`shelter-pricetype-${lvl}`} value={shelters[lvl].pricetype} onChange={(e) => updateShelter(lvl, "pricetype", e.target.value)} options={currencyOptions} />
                    </ShelterTd>
                    <ShelterTd>
                      <InputField id={`shelter-buildtime-${lvl}`} type="number" value={shelters[lvl].buildTime} onChange={(e) => updateShelter(lvl, "buildTime", e.target.value)} />
                    </ShelterTd>
                    <ShelterTd>
                      <InputField id={`shelter-unlocklevel-${lvl}`} type="number" value={shelters[lvl].unlockLevel} onChange={(e) => updateShelter(lvl, "unlockLevel", e.target.value)} />
                    </ShelterTd>
                  </tr>
                ))}
              </tbody>
            </ShelterTable>
          </InfoAccordion>
        </Column>

        <Column $fullWidth>
          <InfoAccordion title={t("games")} icon="/images/icons/play.png" defaultOpen>
            <OriginTransfer
              allOrigins={gameItems}
              selectedIds={gameIds}
              onChange={setGameIds}
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

const ShelterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const ShelterTh = styled.th`
  text-align: left;
  padding: 6px 8px;
  color: #88a04d;
  font-weight: bold;
  font-size: 11px;
  border-bottom: 1px solid #e6eedb;
`;

const ShelterTd = styled.td`
  padding: 6px 8px;
  vertical-align: middle;
`;

const LevelLabel = styled.div`
  font-weight: 600;
  color: #2d5a27;
  white-space: nowrap;
`;
