"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import { RegionInventoryField, RegionInventoryData } from "@/service/RegionInventoryService";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
  breedingCenterSlots: { slot: number }[];
  admissionsBooths: { booth_level: number }[];
  guestLounges: { id: number }[];
}

interface RegionInventoryCardProps {
  region: Region;
  inventory: RegionInventoryData | null;
  onFieldChange: (
    regionId: number,
    field: RegionInventoryField,
    value: boolean | number | null,
  ) => void;
}

export default function RegionInventoryCard({
  region,
  inventory,
  onFieldChange,
}: RegionInventoryCardProps) {
  const t = useTranslations("region");
  const name = region.regionTexts[0]?.name ?? region.identifier;
  const hasGuestLounge = region.guestLounges.length > 0;

  const inv = inventory ?? {
    owned: false,
    breedingCenterSlots: null,
    admissionsBoothLevel: null,
    adminBuilding: false,
    visitorCenter: false,
    transportStation: false,
    guestLounge: false,
  };

  const slotCount = region.breedingCenterSlots.length;
  const boothLevels = region.admissionsBooths.map((b) => b.booth_level);
  const isOwned = inv.owned;

  return (
    <CardContainer>
      <CardHeaderRow>
        <HeaderLeft>
          <RegionImage
            src={`/images/regions/${region.identifier.toLowerCase()}/icon.jpg`}
            alt={name}
            width={32}
            height={32}
          />
          <RegionName>{name}</RegionName>
        </HeaderLeft>
        <CheckboxLabel onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={inv.owned}
            onChange={(e) => onFieldChange(region.id, "owned", e.target.checked)}
          />
        </CheckboxLabel>
      </CardHeaderRow>

      {slotCount > 0 && (
        <FieldRow onClick={(e) => e.stopPropagation()}>
          <FieldLabel>{t("inventory.breeding_slots_unlocked")}</FieldLabel>
          <StyledSelect
            value={inv.breedingCenterSlots ?? 0}
            disabled={!isOwned}
            onChange={(e) =>
              onFieldChange(region.id, "breedingCenterSlots", Number(e.target.value))
            }
          >
            {Array.from({ length: slotCount + 1 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </StyledSelect>
        </FieldRow>
      )}

      {boothLevels.length > 0 && (
        <FieldRow onClick={(e) => e.stopPropagation()}>
          <FieldLabel>{t("inventory.admissions_booth_level")}</FieldLabel>
          <StyledSelect
            value={inv.admissionsBoothLevel ?? 0}
            disabled={!isOwned}
            onChange={(e) =>
              onFieldChange(region.id, "admissionsBoothLevel", Number(e.target.value))
            }
          >
            <option value={0}>0</option>
            {boothLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </StyledSelect>
        </FieldRow>
      )}

      <Divider />

      <BuildingRow onClick={(e) => e.stopPropagation()}>
        <span>{t("inventory.admin_building")}</span>
        <input
          type="checkbox"
          checked={inv.adminBuilding}
          disabled={!isOwned}
          onChange={(e) => onFieldChange(region.id, "adminBuilding", e.target.checked)}
        />
      </BuildingRow>

      <BuildingRow onClick={(e) => e.stopPropagation()}>
        <span>{t("inventory.visitor_center")}</span>
        <input
          type="checkbox"
          checked={inv.visitorCenter}
          disabled={!isOwned}
          onChange={(e) => onFieldChange(region.id, "visitorCenter", e.target.checked)}
        />
      </BuildingRow>

      <BuildingRow onClick={(e) => e.stopPropagation()}>
        <span>{t("inventory.transport_station")}</span>
        <input
          type="checkbox"
          checked={inv.transportStation}
          disabled={!isOwned}
          onChange={(e) => onFieldChange(region.id, "transportStation", e.target.checked)}
        />
      </BuildingRow>

      {hasGuestLounge && (
        <BuildingRow onClick={(e) => e.stopPropagation()}>
          <span>{t("inventory.guest_lounge")}</span>
          <input
            type="checkbox"
            checked={inv.guestLounge}
            disabled={!isOwned}
            onChange={(e) => onFieldChange(region.id, "guestLounge", e.target.checked)}
          />
        </BuildingRow>
      )}
    </CardContainer>
  );
}

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const RegionImage = styled(Image)`
  border-radius: 4px;
  object-fit: cover;
`;

const RegionName = styled.span`
  font-weight: 700;
  font-size: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const FieldLabel = styled.span`
  font-size: 0.875rem;
  flex: 1;
`;

const StyledSelect = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  font-size: 0.875rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: ${({ theme }) => theme.spacing(1)} 0;
`;

const BuildingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(0.5)} 0;

  span {
    font-size: 0.875rem;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;
