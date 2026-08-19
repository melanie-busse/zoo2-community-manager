"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import { getShelterImage } from "@/utils/BiomeUtil";
import PriceBadge from "@/components/ui/badges/PriceBadge";
import DataRow from "@/components/ui/DataRow";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  flex: 1 1 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #2d5a27;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 20px;
    height: 20px;
  }
`;

/* Kräftigere, gut sichtbare Checkbox ohne Ausgrauungs-Effekt */
const CustomCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.checked ? "#2d5a27" : "#ccc")};
  background-color: ${(props) => (props.checked ? "#2d5a27" : "#fff")};
  border-radius: 4px;
  display: grid;
  place-content: center;
  cursor: default;

  &::before {
    content: "";
    width: 10px;
    height: 6px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg) translate(1px, -1px);
    display: ${(props) => (props.checked ? "block" : "none")};
  }
`;

/* Alternativer visueller Badge-Indikator */
const StatusBadge = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${(props) => (props.$active ? "#e8f5e9" : "#ffebee")};
  color: ${(props) => (props.$active ? "#2e7d32" : "#c62828")};
  border: 1px solid ${(props) => (props.$active ? "#a5d6a7" : "#ef9a9a")};
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 15px;

  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChanceGroup = styled.div`
  background: #f9fbf9;
  border: 1px solid #e8f0e8;
  border-radius: 8px;
  padding: 12px;
`;

const GroupTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: #3b6e34;
  font-weight: 600;
  border-bottom: 1px solid #e0eae0;
  padding-bottom: 4px;
`;

export default function BreedingSection() {
  const tAnimals = useTranslations("animal");
  const tBiomes = useTranslations("biome");
  const tCommon = useTranslations("common");
  const tSpecialCoat = useTranslations("specialCoat");

  const animal = useAnimalStore((state) => state.selectedAnimal);
  const specialCoat = useSpecialCoatStore((state) => state.selectedSpecialCoat);

  if (!animal || !specialCoat) return null;

  return (
    <Container>
      {/* Links: Zucht-Variante & Wahrscheinlichkeiten */}
      <Card>
        <Title>
          <img src="/images/icons/breeding.png" alt="" />
          {tSpecialCoat("breeding.title")}
        </Title>

        <DataRow label={tSpecialCoat("breeding.parentWithCoatNeeded")}>
          <CustomCheckbox checked={!!specialCoat.parentWithCoatNeeded} readOnly />
        </DataRow>

        <SectionGrid>
          <ChanceGroup>
            <GroupTitle>Basischance</GroupTitle>
            <DataRow label="ohne Elternteil">
              <strong>{specialCoat.chanceBaseWithoutParent ?? 0} %</strong>
            </DataRow>
            <DataRow label="mit Elternteil">
              <strong>{specialCoat.chanceBaseWithOneParent ?? 0} %</strong>
            </DataRow>
          </ChanceGroup>

          <ChanceGroup>
            <GroupTitle>Eventchance</GroupTitle>
            <DataRow label="ohne Elternteil">
              <strong>{specialCoat.chanceEventWithoutParent ?? 0} %</strong>
            </DataRow>
            <DataRow label="mit Elternteil">
              <strong>{specialCoat.chanceEventWithOneParent ?? 0} %</strong>
            </DataRow>
          </ChanceGroup>
        </SectionGrid>
      </Card>

      {/* Rechts: Zucht-Bedingungen */}
      <Card>
        <Title>
          <img src="/images/icons/breeding.png" alt="" />
          {tAnimals("breeding.breeding")}
        </Title>

        <DataRow label={tBiomes("shelterLevel")}>
          <ShelterLevelBadge
            image={getShelterImage(animal.biome)}
            level={animal.shelterLevel ?? 0}
            habitat={animal.biome?.name}
            size={35}
            showTooltip={false}
          />
        </DataRow>

        <DataRow label={tCommon("price")}>
          <PriceBadge value={animal.breedingCost || 0} type="Zoodollar" />
        </DataRow>

        <DataRow label={tCommon("time")}>
          <strong>{animal.breedingDuration || 0} h</strong>
        </DataRow>

        <DataRow label={tAnimals("breeding.breedingChance")}>
          <strong>{animal.breedingProbability || 0} %</strong>
        </DataRow>
      </Card>
    </Container>
  );
}
