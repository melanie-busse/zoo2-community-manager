"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DynamicRowInput from "@/components/ui/form/DynamicRowInput";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";

interface EnclosureCapacitySectionProps {
  enclosureSizes: any[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function EnclosureCapacitySection({
  enclosureSizes = [],
  setFormData,
}: EnclosureCapacitySectionProps) {
  const tAnimals = useTranslations("Animals");

  const safeSizes = (Array.isArray(enclosureSizes) ? enclosureSizes : []).map(
    (item: any, index) => {
      const animalCount = item.animalCount ?? item.numberAnimals ?? 0;
      const size = item.size ?? item.numberEnclosure ?? 0;
      return {
        id: item.id ?? animalCount ?? `static-${index}`,
        animalCount,
        size,
      };
    },
  );

  const onAdd = () => {
    const lastCount = safeSizes.length > 0 ? safeSizes[safeSizes.length - 1].animalCount : 0;
    const nextCount = lastCount + 1;

    setFormData((prev: any) => ({
      ...prev,
      enclosureSizes: [
        ...(Array.isArray(prev.enclosureSizes) ? prev.enclosureSizes : []),
        { id: nextCount, animalCount: nextCount, size: 0 },
      ],
    }));
  };

  const onRemove = (id: number | string) => {
    setFormData((prev: any) => ({
      ...prev,
      enclosureSizes: safeSizes.filter((item) => item.id !== id),
    }));
  };

  const onChange = (id: number | string, field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      enclosureSizes: safeSizes.map((item) =>
        item.id === id ? { ...item, [field]: parseInt(val, 10) || 0 } : item,
      ),
    }));
  };

  return (
    <InfoAccordion
      title={tAnimals("capacityTableLabel")}
      icon="/images/icons/enclosureUpgrade.png"
      defaultOpen={false}
    >
      <SectionColumn>
        <DynamicRowInput
          rows={safeSizes}
          columns={[
            {
              key: "animalCount",
              label: tAnimals("animalCount") || "Tieranzahl",
              type: "number",
              $flex: 1,
              placeholder: "1",
            },
            {
              key: "size",
              label: tAnimals("requiredSize") || "Benötigte Felder",
              type: "number",
              $flex: 1,
              placeholder: "z.B. 10",
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
