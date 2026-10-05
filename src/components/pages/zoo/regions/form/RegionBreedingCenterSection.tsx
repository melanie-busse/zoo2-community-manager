"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";
import FormRow from "@/components/ui/form/styling/FormRow";

interface RegionBreedingCenterSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegionBreedingCenterSection({
  formData,
  setFormData,
}: RegionBreedingCenterSectionProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const CURRENCY_OPTIONS = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const slots = Array.isArray(formData.breedingCenterSlots) ? formData.breedingCenterSlots : [];

  const onAdd = () => {
    setFormData((p: any) => ({
      ...p,
      breedingCenterSlots: [
        ...p.breedingCenterSlots,
        { id: Date.now(), slot: "", price: "", pricetype: "1" },
      ],
    }));
  };

  const onRemove = (id: number | string) => {
    setFormData((p: any) => ({
      ...p,
      breedingCenterSlots: p.breedingCenterSlots.filter((s: any) => s.id !== id),
    }));
  };

  const onChange = (id: number | string, key: string, val: string) => {
    setFormData((p: any) => ({
      ...p,
      breedingCenterSlots: p.breedingCenterSlots.map((s: any) =>
        s.id === id ? { ...s, [key]: val } : s,
      ),
    }));
  };

  return (
    <InfoAccordion
      title={tRegion("breeding_center")}
      icon="/images/icons/breeding.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="breedingCenter-price">{tCommon("price")}</Label>
          <FormRow>
            <InputField
              id="breedingCenter-price"
              type="number"
              value={formData.breedingCenter?.price ?? ""}
              onChange={(e) =>
                setFormData((p: any) => ({
                  ...p,
                  breedingCenter: { ...p.breedingCenter, price: e.target.value },
                }))
              }
            />
            <Selectbox
              id="breedingCenter-pricetype"
              name="breedingCenter-pricetype"
              value={formData.breedingCenter?.pricetype?.toString() ?? "1"}
              onChange={(e) =>
                setFormData((p: any) => ({
                  ...p,
                  breedingCenter: { ...p.breedingCenter, pricetype: e.target.value },
                }))
              }
              options={CURRENCY_OPTIONS}
            />
          </FormRow>
        </FormGroup>

        <DynamicRowInput
          label={tRegion("breeding_slots")}
          rows={slots}
          columns={[
            { key: "slot", label: tRegion("slot"), type: "number", $flex: 0.5 },
            { key: "price", label: tCommon("price"), type: "number", $flex: 1 },
            {
              key: "pricetype",
              label: tRegion("price_type"),
              type: "select",
              $flex: 0.8,
              options: CURRENCY_OPTIONS,
            },
          ]}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
        />
      </SectionColumn>
    </InfoAccordion>
  );
}
