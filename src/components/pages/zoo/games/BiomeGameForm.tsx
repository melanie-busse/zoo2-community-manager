"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { updateBiomeGameOnClient } from "@/service/frontend/BiomeGame";
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

interface BiomeGameFormProps {
  game: {
    id: number;
    identifier: string;
    biomeIdentifier: string;
    price: number;
    pricetype: number;
    repair: number;
    repairpricetype: number;
    texts: { languageCode: string; name: string }[];
  };
  languages: Language[];
}

export default function BiomeGameForm({ game, languages }: BiomeGameFormProps) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [price, setPrice] = useState(game.price.toString());
  const [pricetype, setPricetype] = useState(game.pricetype.toString());
  const [repair, setRepair] = useState(game.repair.toString());
  const [repairpricetype, setRepairpricetype] = useState(game.repairpricetype.toString());
  const [texts, setTexts] = useState<{ languageCode: string; name: string }[]>(() => {
    const textMap = new Map(game.texts.map((tx) => [tx.languageCode, tx.name]));
    return languages.map((l) => ({ languageCode: l.code, name: textMap.get(l.code) ?? "" }));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const updateText = (code: string, name: string) => {
    setTexts((prev) => prev.map((tx) => (tx.languageCode === code ? { ...tx, name } : tx)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateBiomeGameOnClient(game.id, {
        price: parseInt(price) || 0,
        pricetype: parseInt(pricetype) || 1,
        repair: parseInt(repair) || 0,
        repairpricetype: parseInt(repairpricetype) || 1,
        texts,
      });
      toast.success(t("form.messages.editSuccess"));
      router.push("/zoo/games");
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
                <InputField id="identifier" type="text" value={game.identifier} disabled />
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
              <FormRow>
                <FormGroup>
                  <Label htmlFor="repair">{t("repair")}</Label>
                  <InputField
                    id="repair"
                    type="number"
                    value={repair}
                    onChange={(e) => setRepair(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="repairpricetype">{t("form.currency")}</Label>
                  <Selectbox
                    id="repairpricetype"
                    name="repairpricetype"
                    value={repairpricetype}
                    onChange={(e) => setRepairpricetype(e.target.value)}
                    options={currencyOptions}
                  />
                </FormGroup>
              </FormRow>
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
        label={isSubmitting ? tCommon("saving") : t("form.save_game")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
