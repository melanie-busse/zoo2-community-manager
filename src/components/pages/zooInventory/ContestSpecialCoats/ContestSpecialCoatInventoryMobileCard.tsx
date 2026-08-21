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

interface ContestSpecialCoatInventoryMobileCardProps {
  coat: any;
  inventoryPuzzlePieces: number | null;
  inventoryRegionId: number | null;
  regions: Region[];
  onInventoryChange: (
    specialCoatId: number,
    field: "puzzlePieces" | "regionId",
    value: number | null,
  ) => void;
}

export default function ContestSpecialCoatInventoryMobileCard({
  coat,
  inventoryPuzzlePieces,
  inventoryRegionId,
  regions,
  onInventoryChange,
}: ContestSpecialCoatInventoryMobileCardProps) {
  const router = useRouter();
  const tSpecialCoat = useTranslations("specialCoat");
  const tAnimal = useTranslations("animal");

  const displayName = coat.specialcoatstext?.[0]?.name ?? tSpecialCoat("noName");

  return (
    <CardContainer onClick={() => router.push(`/specialcoats/${coat.id}`)}>
      <CardHeaderRow>
        <Name>{displayName}</Name>
      </CardHeaderRow>

      <CardDivider />

      <InventoryRow>
        <GameBadge image={getSpecialCoatImage(coat)} size={60} />

        <FieldsGrid onClick={(e) => e.stopPropagation()}>
          <FieldRow>
            <FieldLabel>{tAnimal("statue.puzzle_pieces")}</FieldLabel>
            <input
              type="number"
              min={0}
              value={inventoryPuzzlePieces ?? ""}
              onChange={(e) =>
                onInventoryChange(
                  coat.id,
                  "puzzlePieces",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              style={{
                width: "70px",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                textAlign: "right",
              }}
            />
          </FieldRow>

          <FieldRow>
            <FieldLabel>{tAnimal("inventory.region")}</FieldLabel>
            <SelectBoxWithImage<Region>
              items={regions}
              selectedValue={inventoryRegionId !== null ? String(inventoryRegionId) : "all"}
              onSelectAction={(val) =>
                onInventoryChange(coat.id, "regionId", val === "all" ? null : Number(val))
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
