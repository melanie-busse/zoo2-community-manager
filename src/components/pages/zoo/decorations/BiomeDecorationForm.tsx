"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { createBiomeDecorationOnClient, updateBiomeDecorationOnClient } from "@/service/frontend/BiomeDecoration";
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

interface Biome {
  id: number;
  identifier: string;
  biomestext: { biomeName: string }[];
}

interface BiomeDecorationFormProps {
  decoration?: {
    id: number;
    identifier: string;
    biomeId: number;
    price: number;
    pricetype: number;
    popularity: number;
    texts: { languageCode: string; name: string }[];
  };
  languages: Language[];
  biomes: Biome[];
}

export default function BiomeDecorationForm({ decoration, languages, biomes }: BiomeDecorationFormProps) {
  const t = useTranslations("decoration");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [identifier, setIdentifier] = useState(decoration?.identifier ?? "");
  const [biomeId, setBiomeId] = useState(decoration?.biomeId?.toString() ?? "");
  const [price, setPrice] = useState(decoration?.price?.toString() ?? "");
  const [pricetype, setPricetype] = useState(decoration?.pricetype?.toString() ?? "1");
  const [popularity, setPopularity] = useState(decoration?.popularity?.toString() ?? "");
  const [texts, setTexts] = useState<{ languageCode: string; name: string }[]>(() => {
    const textMap = new Map(decoration?.texts.map((tx) => [tx.languageCode, tx.name]) ?? []);
    return languages.map((l) => ({ languageCode: l.code, name: textMap.get(l.code) ?? "" }));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const biomeOptions = [
    { value: "", label: "-" },
    ...biomes.map((b) => ({ value: String(b.id), label: b.biomestext[0]?.biomeName ?? b.identifier })),
  ];

  const updateText = (code: string, name: string) => {
    setTexts((prev) => prev.map((tx) => (tx.languageCode === code ? { ...tx, name } : tx)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!identifier.trim()) {
      toast.warn(t("form.messages.requiredIdentifier"));
      return;
    }
    if (!biomeId) {
      toast.warn(t("form.messages.requiredBiome"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        identifier,
        biomeId: parseInt(biomeId, 10),
        price: parseInt(price) || 0,
        pricetype: parseInt(pricetype) || 1,
        popularity: parseInt(popularity) || 0,
        texts,
      };
      if (decoration?.id) {
        await updateBiomeDecorationOnClient(decoration.id, data);
        toast.success(t("form.messages.editSuccess"));
      } else {
        await createBiomeDecorationOnClient(data);
        toast.success(t("form.messages.createSuccess"));
      }
      router.push("/zoo/decorations");
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
                  disabled={!!decoration}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="biomeId">{t("form.biome")}</Label>
                <Selectbox
                  id="biomeId"
                  name="biomeId"
                  value={biomeId}
                  onChange={(e) => setBiomeId(e.target.value)}
                  options={biomeOptions}
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="price">{t("price")}</Label>
                  <InputField
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="pricetype">{t("form.currency")}</Label>
                  <Selectbox
                    id="pricetype"
                    name="pricetype"
                    value={pricetype}
                    onChange={(e) => setPricetype(e.target.value)}
                    options={currencyOptions}
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label htmlFor="popularity">{t("popularity")}</Label>
                <InputField
                  id="popularity"
                  type="number"
                  value={popularity}
                  onChange={(e) => setPopularity(e.target.value)}
                />
              </FormGroup>
            </SectionColumn>
          </InfoAccordion>
        </Column>
        <Column>
          <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              {texts.map((tx) => {
                const lang = languages.find((l) => l.code === tx.languageCode);
                return (
                  <FormGroup key={tx.languageCode}>
                    <Label htmlFor={`name-${tx.languageCode}`}>{lang?.name ?? tx.languageCode}</Label>
                    <InputField
                      id={`name-${tx.languageCode}`}
                      type="text"
                      value={tx.name}
                      onChange={(e) => updateText(tx.languageCode, e.target.value)}
                    />
                  </FormGroup>
                );
              })}
            </SectionColumn>
          </InfoAccordion>
        </Column>
      </FormGrid>
      <SubmitButton
        label={isSubmitting ? tCommon("saving") : decoration ? t("form.save_decoration") : t("form.create_decoration")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
