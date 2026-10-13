"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import Image from "next/image";

import CardContainer from "@/components/page-structure/Card/CardContainer";
import CardHeaderRow from "@/components/page-structure/Card/CardHeaderRow";
import { BiomeInventoryField, BiomeInventoryData } from "@/service/BiomeInventoryService";

interface Game {
  id: number;
  texts: { name: string }[];
  identifier: string;
}

interface Biome {
  id: number;
  identifier: string;
  biomestext: { biomeName: string }[];
  games: Game[];
}

interface BiomeInventoryCardProps {
  biome: Biome;
  inventory: BiomeInventoryData | null;
  gameInventory: Map<number, number>;
  onFieldChange: (biomeId: number, field: BiomeInventoryField, value: boolean | number) => void;
  onGameChange: (biomeGameId: number, count: number) => void;
}

const SHELTER_LEVELS = [0, 1, 2, 3] as const;

export default function BiomeInventoryCard({
  biome,
  inventory,
  gameInventory,
  onFieldChange,
  onGameChange,
}: BiomeInventoryCardProps) {
  const t = useTranslations("biome");
  const name = biome.biomestext[0]?.biomeName ?? biome.identifier;

  const inv = inventory ?? {
    enclosure: false,
    trough: false,
    waterHole: false,
    shelterLevel0: 0,
    shelterLevel1: 0,
    shelterLevel2: 0,
    shelterLevel3: 0,
  };

  const isOwned = inv.enclosure;

  return (
    <CardContainer>
      <CardHeaderRow>
        <HeaderLeft>
          <BiomeImage
            src={`/images/biomes/${biome.identifier.toLowerCase()}/icon.jpg`}
            alt={name}
            width={32}
            height={32}
          />
          <BiomeName>{name}</BiomeName>
        </HeaderLeft>
        <CheckboxLabel onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={inv.enclosure}
            onChange={(e) => onFieldChange(biome.id, "enclosure", e.target.checked)}
          />
        </CheckboxLabel>
      </CardHeaderRow>

      <BuildingRow onClick={(e) => e.stopPropagation()}>
        <span>{t("inventory.trough")}</span>
        <input
          type="checkbox"
          checked={inv.trough}
          disabled={!isOwned}
          onChange={(e) => onFieldChange(biome.id, "trough", e.target.checked)}
        />
      </BuildingRow>

      <BuildingRow onClick={(e) => e.stopPropagation()}>
        <span>{t("inventory.water_hole")}</span>
        <input
          type="checkbox"
          checked={inv.waterHole}
          disabled={!isOwned}
          onChange={(e) => onFieldChange(biome.id, "waterHole", e.target.checked)}
        />
      </BuildingRow>

      <Divider />

      {SHELTER_LEVELS.map((level) => {
        const field = `shelterLevel${level}` as BiomeInventoryField;
        const currentValue = inv[field] as number;
        return (
          <FieldRow key={level} onClick={(e) => e.stopPropagation()}>
            <FieldLabel>{t("inventory.shelter_level", { level })}</FieldLabel>
            <StyledSelect
              value={currentValue}
              disabled={!isOwned}
              onChange={(e) => onFieldChange(biome.id, field, Number(e.target.value))}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </StyledSelect>
          </FieldRow>
        );
      })}

      {biome.games.length > 0 && (
        <>
          <Divider />
          <SectionTitle>{t("inventory.games")}</SectionTitle>
          {biome.games.map((game) => {
            const gameName = game.texts[0]?.name ?? game.identifier;
            const count = gameInventory.get(game.id) ?? 0;
            return (
              <FieldRow key={game.id} onClick={(e) => e.stopPropagation()}>
                <FieldLabel>{gameName}</FieldLabel>
                <StyledSelect
                  value={count}
                  disabled={!isOwned}
                  onChange={(e) => onGameChange(game.id, Number(e.target.value))}
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </StyledSelect>
              </FieldRow>
            );
          })}
        </>
      )}
    </CardContainer>
  );
}

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const BiomeImage = styled(Image)`
  border-radius: 4px;
  object-fit: cover;
`;

const BiomeName = styled.span`
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: ${({ theme }) => theme.spacing(1)} 0;
`;

const SectionTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(0.5)} 0;
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
