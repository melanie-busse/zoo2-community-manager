"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { Biome } from "@/types/biome";

type FilterValue = "all" | "missing" | "imported" | "needs_update";

interface AnimalStatusItem {
  biome: Biome | null;
}

interface WikiDashboardFilterBarProps {
  filter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBiome: string | null;
  onBiomeChange: (biome: string | null) => void;
  animals: AnimalStatusItem[];
}

export default function WikiDashboardFilterBar({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  selectedBiome,
  onBiomeChange,
  animals,
}: WikiDashboardFilterBarProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const biomeItems = animals.map((a) => ({ biome: a.biome }));

  return (
    <FilterWrapper>
      <FilterCard>
        <ButtonRow>
          <Styles.FilterButton $active={filter === "all"} onClick={() => onFilterChange("all")}>
            {t("filter_all")}
          </Styles.FilterButton>
          <Styles.FilterButton
            $active={filter === "missing"}
            onClick={() => onFilterChange("missing")}
          >
            {t("filter_missing")}
          </Styles.FilterButton>
          <Styles.FilterButton
            $active={filter === "imported"}
            onClick={() => onFilterChange("imported")}
          >
            {t("filter_in_db")}
          </Styles.FilterButton>
          <Styles.FilterButton
            $active={filter === "needs_update"}
            onClick={() => onFilterChange("needs_update")}
          >
            {t("filter_needs_update")}
          </Styles.FilterButton>
        </ButtonRow>
        <SearchInputField
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={tCommon("filter.search_placeholder")}
        />
        <BiomeSelect items={biomeItems} selectedBiome={selectedBiome} onChange={onBiomeChange} />
      </FilterCard>
    </FilterWrapper>
  );
}

const FilterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;

  & > button {
    flex: 1;
  }
`;
