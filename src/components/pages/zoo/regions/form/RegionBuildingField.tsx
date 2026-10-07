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

interface RegionBuildingFieldProps {
  title: string;
  icon: string;
  formKey: "adminBuilding" | "visitorCenter" | "transportStation";
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegionBuildingField({
  title,
  icon,
  formKey,
  formData,
  setFormData,
}: RegionBuildingFieldProps) {
  const tCommon = useTranslations("common");

  const CURRENCY_OPTIONS = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  return (
    <InfoAccordion title={title} icon={icon} defaultOpen={true}>
      <SectionColumn>
        <FormGroup>
          <Label htmlFor={`${formKey}-price`}>{tCommon("price")}</Label>
          <FormRow>
            <InputField
              id={`${formKey}-price`}
              type="number"
              value={formData[formKey]?.price ?? ""}
              onChange={(e) =>
                setFormData((p: any) => ({
                  ...p,
                  [formKey]: { ...p[formKey], price: e.target.value },
                }))
              }
            />
            <Selectbox
              id={`${formKey}-pricetype`}
              name={`${formKey}-pricetype`}
              value={formData[formKey]?.pricetype?.toString() ?? "1"}
              onChange={(e) =>
                setFormData((p: any) => ({
                  ...p,
                  [formKey]: { ...p[formKey], pricetype: e.target.value },
                }))
              }
              options={CURRENCY_OPTIONS}
            />
          </FormRow>
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
