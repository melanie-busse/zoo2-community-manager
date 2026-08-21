"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import { Name } from "@/components/elements/Name/Name";
import GameBadge from "@/components/ui/badges/GameBadge";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface SpecialCoatsInventoryMobileCardProps {
  specialCoat: any;
  inventoryCount: number;
  inventoryLevel10: boolean;
  inventoryLevel20: boolean;
  inventoryGlitter: boolean;
  inventoryRegionId: number | null;
  regions: Region[];
  onInventoryChange: (
    specialCoatId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
    value: number | boolean | null,
  ) => void;
}

export default function SpecialCoatsInventoryMobileCard({
  specialCoat,
  inventoryCount,
  inventoryLevel10,
  inventoryLevel20,
  inventoryGlitter,
  inventoryRegionId,
  regions,
  onInventoryChange,
}: SpecialCoatsInventoryMobileCardProps) {
  const router = useRouter();
  const tSpecialCoat = useTranslations("specialCoat");

  const displayName = specialCoat.specialcoatstext?.[0]?.name ?? tSpecialCoat("noName");

  return (
    <CardContainer onClick={() => router.push(`/specialcoats/${specialCoat.id}`)}>
      <CardHeaderRow>
        <Name>{displayName}</Name>
      </CardHeaderRow>

      <CardDivider />

      <InventoryRow>
        <GameBadge image={getSpecialCoatImage(specialCoat)} size={60} />

        <FieldsGrid onClick={(e) => e.stopPropagation()}>
          <FieldRow>
            <FieldLabel>{tSpecialCoat("inventory.count")}</FieldLabel>
            <select
              value={inventoryCount}
              onChange={(e) =>
                onInventoryChange(specialCoat.id, "count", Number(e.target.value))
              }
              style={{ padding: "2px 6px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tSpecialCoat("inventory.level10")}</FieldLabel>
            <input
              type="checkbox"
              checked={inventoryLevel10}
              onChange={(e) => onInventoryChange(specialCoat.id, "level10", e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tSpecialCoat("inventory.level20")}</FieldLabel>
            <input
              type="checkbox"
              checked={inventoryLevel20}
              onChange={(e) => onInventoryChange(specialCoat.id, "level20", e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tSpecialCoat("inventory.glitter_animal")}</FieldLabel>
            <input
              type="checkbox"
              checked={inventoryGlitter}
              onChange={(e) =>
                onInventoryChange(specialCoat.id, "glitterAnimal", e.target.checked)
              }
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tSpecialCoat("inventory.region")}</FieldLabel>
            <SelectBoxWithImage<Region>
              items={regions}
              selectedValue={inventoryRegionId !== null ? String(inventoryRegionId) : "all"}
              onSelectAction={(val) =>
                onInventoryChange(
                  specialCoat.id,
                  "regionId",
                  val === "all" ? null : Number(val),
                )
              }
              allLabelKey="no_region"
              showLabel={false}
              compact={true}
              renderAllBadge={() => (
                <RegionBadge
                  image={{
                    path: "/images/icons/globus.png",
                    name: "globus",
                    alt: "Keine Region",
                  }}
                  size={32}
                  showTooltip={true}
                  tooltipLabel="Keine Region"
                />
              )}
              getIdentifier={(region) => String(region.id)}
              renderBadge={(region) => (
                <RegionBadge
                  image={{
                    path: `/images/regions/${region.identifier.toLowerCase()}/icon.jpg`,
                    name: region.regionTexts[0]?.name ?? region.identifier,
                    alt: region.regionTexts[0]?.name ?? region.identifier,
                  }}
                  size={32}
                  showTooltip={true}
                  tooltipLabel={region.regionTexts[0]?.name ?? region.identifier}
                />
              )}
            />
          </FieldRow>
        </FieldsGrid>
      </InventoryRow>
    </CardContainer>
  );
}

const InventoryRow = styled.div`
  display: flex;
  gap: 50px;
  align-items: flex-start;
  padding-top: 8px;
`;

const FieldsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
`;

const FieldLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.ui.textMain};
  min-width: 90px;
`;