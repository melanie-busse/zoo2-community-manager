"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";
import FormRow from "@/components/ui/form/styling/FormRow";

interface RegionPriceSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegionPriceSection({ formData, setFormData }: RegionPriceSectionProps) {
  const tCommon = useTranslations("common");

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  return (
    <InfoAccordion
      title={tCommon("price")}
      icon="/images/currency/diamant.webp"
      defaultOpen={true}
    >
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="price">{tCommon("price")}</Label>
          <FormRow>
            <InputField
              id="price"
              type="number"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, price: e.target.value }))
              }
            />
            <Selectbox
              id="priceTypeId"
              name="priceTypeId"
              value={formData.priceTypeId?.toString() ?? "1"}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, priceTypeId: e.target.value }))
              }
              options={currencyOptions}
            />
          </FormRow>
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
