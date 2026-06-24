"use client";

import React from "react";
import { useTranslations } from "next-intl";
import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";

interface OriginOption {
  id: number;
  name: string;
}

interface OriginSectionProps {
  originsData: OriginOption[];
  selectedOrigins: Array<{ id: number }>; // Typisiert auf das, was im Zustand-Store liegt
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function OriginSection({
  originsData = [],
  selectedOrigins = [],
  setFormData,
}: OriginSectionProps) {
  const tAnimals = useTranslations("Animals");

  const handleTransferChange = (newSelectedIds: number[]) => {
    setFormData((prev: any) => ({
      ...prev,
      origins: newSelectedIds.map((id) => ({ id })),
    }));
  };

  const selectedIds = selectedOrigins.map((o) => o.id);

  return (
    <InfoAccordion
      title={tAnimals("originSection.originTitle") || "Herkunft & Quellen"}
      icon="/images/origins/shop.webp"
      defaultOpen={false}
    >
      <Styles.SectionColumn>
        <p className="description">
          {tAnimals("originSection.originDescription") ||
            "Wähle aus, wie dieses Tier im Spiel erworben werden kann."}
        </p>

        <OriginTransfer
          allOrigins={originsData}
          selectedIds={selectedIds}
          onChange={handleTransferChange}
        />
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
