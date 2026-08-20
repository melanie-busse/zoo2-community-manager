"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";

interface OriginOption {
  id: number;
  name: string;
}

interface OriginSectionProps {
  originsData: OriginOption[];
  selectedOrigins: Array<{ id: number }>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function OriginSection({
  originsData = [],
  selectedOrigins = [],
  setFormData,
}: OriginSectionProps) {
  const tAnimals = useTranslations("animal");

  const handleTransferChange = (newSelectedIds: number[]) => {
    setFormData((prev: any) => ({
      ...prev,
      origins: newSelectedIds.map((id) => ({ id })),
    }));
  };

  const selectedIds = selectedOrigins.map((o) => o.id);

  return (
    <InfoAccordion
      title={tAnimals("originSection.originTitle")}
      icon="/images/origins/shop.png"
      defaultOpen={false}
    >
      <SectionColumn>
        <p className="description">{tAnimals("originSection.originDescription")}</p>

        <OriginTransfer
          allOrigins={originsData}
          selectedIds={selectedIds}
          onChange={handleTransferChange}
        />
      </SectionColumn>
    </InfoAccordion>
  );
}
