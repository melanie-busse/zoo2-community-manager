"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import InputGroup from "@/components/ui/form/InputGroup";

interface PriceSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function PriceSection({ formData, setFormData }: PriceSectionProps) {
  const tAnimals = useTranslations("Animals");
  const tCommon = useTranslations("Common");

  const currencyOptions = [
    { value: "1", label: "Zoodollar" },
    { value: "2", label: "Diamanten" },
  ];

  const handleNumberChange =
    (key: string, isInt: boolean = true) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setFormData((prev: any) => ({
        ...prev,
        [key]: val !== "" ? (isInt ? parseInt(val, 10) : parseFloat(val)) : null,
      }));
    };

  return (
    <InfoAccordion
      title={tAnimals("priceSection.pricesAndValues")}
      icon="/images/currency/zoodollar.webp"
      defaultOpen={true}
    >
      <Styles.SectionColumn>
        <Styles.FormGroup>
          <Styles.Label htmlFor="price">{tCommon("price")}</Styles.Label>
          <Styles.FormRow>
            <InputField
              id="price"
              type="number"
              name="price"
              value={formData?.price ?? ""}
              onChange={handleNumberChange("price")}
            />
            <Selectbox
              id="currencyId"
              name="currencyId"
              value={formData?.currencyId?.toString() ?? "1"}
              onChange={handleNumberChange("currencyId")}
              options={currencyOptions}
            />
          </Styles.FormRow>
        </Styles.FormGroup>

        <Styles.FormGroup>
          <Styles.Label htmlFor="popularity">{tCommon("popularity") || "Beliebtheit"}</Styles.Label>
          <InputGroup icon="/images/icons/visitors.jpg" iconSize="24px">
            <InputField
              id="popularity"
              type="number"
              name="popularity"
              value={formData?.popularity ?? ""}
              onChange={handleNumberChange("popularity")}
            />
          </InputGroup>
        </Styles.FormGroup>

        <Styles.FormGroup>
          <Styles.Label htmlFor="sellingPrice">{tCommon("selling_price")}</Styles.Label>
          <InputGroup icon="/images/currency/zoodollar.webp" iconSize="24px">
            <InputField
              id="sellingPrice"
              type="number"
              name="sellingPrice"
              value={formData?.sellingPrice ?? ""}
              onChange={handleNumberChange("sellingPrice")}
            />
          </InputGroup>
        </Styles.FormGroup>

        <Styles.FormGroup>
          <Styles.Label htmlFor="releaseExp">{tAnimals("release")}</Styles.Label>
          <InputGroup icon="/images/icons/star.png" iconSize="24px">
            <InputField
              id="releaseExp"
              type="number"
              name="releaseExp"
              value={formData?.releaseExp ?? ""}
              onChange={handleNumberChange("releaseExp")}
            />
          </InputGroup>
        </Styles.FormGroup>
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
