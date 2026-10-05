"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";

interface RegionAdmissionsBoothSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  defaultOpen?: boolean;
}

export default function RegionAdmissionsBoothSection({
  formData,
  setFormData,
  defaultOpen = true,
}: RegionAdmissionsBoothSectionProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const CURRENCY_OPTIONS = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const booths = Array.isArray(formData.admissionsBooths) ? formData.admissionsBooths : [];

  const onAdd = () => {
    setFormData((p: any) => ({
      ...p,
      admissionsBooths: [
        ...p.admissionsBooths,
        { id: Date.now(), booth_level: "", max_capacity: "", upgrade: "", pricetype: "1" },
      ],
    }));
  };

  const onRemove = (id: number | string) => {
    setFormData((p: any) => ({
      ...p,
      admissionsBooths: p.admissionsBooths.filter((b: any) => b.id !== id),
    }));
  };

  const onChange = (id: number | string, key: string, val: string) => {
    setFormData((p: any) => ({
      ...p,
      admissionsBooths: p.admissionsBooths.map((b: any) =>
        b.id === id ? { ...b, [key]: val } : b,
      ),
    }));
  };

  return (
    <InfoAccordion
      title={tRegion("admissions_booth")}
      icon="/images/icons/visitors.jpg"
      defaultOpen={defaultOpen}
    >
      <SectionColumn>
        <DynamicRowInput
          label=""
          rows={booths}
          columns={[
            { key: "booth_level", label: tRegion("booth_level"), type: "number", $flex: 0.6 },
            { key: "max_capacity", label: tRegion("max_capacity"), type: "number", $flex: 0.8 },
            { key: "upgrade", label: tRegion("upgrade"), type: "number", $flex: 0.6 },
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
