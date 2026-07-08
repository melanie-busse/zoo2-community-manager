"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import InputGroup from "@/components/ui/form/InputGroup";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";
import FormRow from "@/components/ui/form/styling/FormRow";

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
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="price">{tCommon("price")}</Label>
          <FormRow>
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
          </FormRow>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="popularity">{tCommon("popularity") || "Beliebtheit"}</Label>
          <InputGroup icon="/images/icons/visitors.jpg" iconSize="24px">
            <InputField
              id="popularity"
              type="number"
              name="popularity"
              value={formData?.popularity ?? ""}
              onChange={handleNumberChange("popularity")}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="sellingPrice">{tCommon("selling_price")}</Label>
          <InputGroup icon="/images/currency/zoodollar.webp" iconSize="24px">
            <InputField
              id="sellingPrice"
              type="number"
              name="sellingPrice"
              value={formData?.sellingPrice ?? ""}
              onChange={handleNumberChange("sellingPrice")}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="releaseExp">{tAnimals("release")}</Label>
          <InputGroup icon="/images/icons/star.png" iconSize="24px">
            <InputField
              id="releaseExp"
              type="number"
              name="releaseExp"
              value={formData?.releaseExp ?? ""}
              onChange={handleNumberChange("releaseExp")}
            />
          </InputGroup>
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
