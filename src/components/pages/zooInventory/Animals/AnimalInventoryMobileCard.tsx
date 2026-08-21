"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import { Animal } from "@/types/animal";
import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import CardDivider from "@/components/page-structure/Card/CardDevider";
import { Name } from "@/components/elements/Name/Name";
import GameBadge from "@/components/ui/badges/GameBadge";
import { getAnimalImage } from "@/utils/AnimalUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface AnimalInventoryMobileCardProps {
  animal: Animal & {
    inventoryCount?: number;
    inventoryLevel10?: boolean;
    inventoryLevel20?: boolean;
    inventoryGlitter?: boolean;
    inventoryRegionId?: number | null;
  };
  regions: Region[];
  onInventoryChange: (
    animalId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
    value: number | boolean | null,
  ) => void;
}

export default function AnimalInventoryMobileCard({
  animal,
  regions,
  onInventoryChange,
}: AnimalInventoryMobileCardProps) {
  const router = useRouter();
  const tAnimal = useTranslations("animal");

  const displayName = animal.animaltext?.[0]?.animalName ?? tAnimal("noName");
  const currentCount = animal.inventoryCount ?? 0;
  const currentLevel10 = animal.inventoryLevel10 ?? false;
  const currentLevel20 = animal.inventoryLevel20 ?? false;
  const currentGlitter = animal.inventoryGlitter ?? false;
  const currentRegionId = animal.inventoryRegionId ?? null;

  return (
    <CardContainer onClick={() => router.push(`/animals/${animal.id}`)}>
      <CardHeaderRow>
        <Name>{displayName}</Name>
      </CardHeaderRow>

      <CardDivider />

      <InventoryRow>
        <GameBadge image={getAnimalImage(animal)} size={60} />

        <FieldsGrid onClick={(e) => e.stopPropagation()}>
          <FieldRow>
            <FieldLabel>{tAnimal("inventory.count")}</FieldLabel>
            <select
              value={currentCount}
              onChange={(e) => onInventoryChange(animal.id, "count", Number(e.target.value))}
              style={{ padding: "2px 6px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tAnimal("inventory.level10")}</FieldLabel>
            <input
              type="checkbox"
              checked={currentLevel10}
              onChange={(e) => onInventoryChange(animal.id, "level10", e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tAnimal("inventory.level20")}</FieldLabel>
            <input
              type="checkbox"
              checked={currentLevel20}
              onChange={(e) => onInventoryChange(animal.id, "level20", e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tAnimal("inventory.glitter_animal")}</FieldLabel>
            <input
              type="checkbox"
              checked={currentGlitter}
              onChange={(e) => onInventoryChange(animal.id, "glitterAnimal", e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tAnimal("inventory.region")}</FieldLabel>
            <SelectBoxWithImage<Region>
              items={regions}
              selectedValue={currentRegionId !== null ? String(currentRegionId) : "all"}
              onSelectAction={(val) =>
                onInventoryChange(animal.id, "regionId", val === "all" ? null : Number(val))
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
