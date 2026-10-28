"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { useChestBoostStore } from "@/store/useChestBoostStore";
import type { ChestType } from "@/types/chestBoost";

interface ChestBoostOverviewFilterProps {
  years: number[];
}

export default function ChestBoostOverviewFilter({ years }: ChestBoostOverviewFilterProps) {
  const t = useTranslations("chestBoosts");

  const searchTerm = useChestBoostStore((state) => state.searchTerm);
  const setSearchTerm = useChestBoostStore((state) => state.setSearchTerm);
  const selectedChestType = useChestBoostStore((state) => state.selectedChestType);
  const setSelectedChestType = useChestBoostStore((state) => state.setSelectedChestType);
  const selectedYear = useChestBoostStore((state) => state.selectedYear);
  const setSelectedYear = useChestBoostStore((state) => state.setSelectedYear);
  const resetFilters = useChestBoostStore((state) => state.resetFilters);

  return (
    <FilterCard>
      <FilterInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("filter_search_animal")}
      />

      <FilterSelect
        value={selectedChestType ?? ""}
        onChange={(e) => setSelectedChestType((e.target.value as ChestType) || null)}
      >
        <option value="">{t("filter_all_chest_types")}</option>
        <option value="EPIC">{t("chest_type_epic")}</option>
        <option value="RETRO">{t("chest_type_retro")}</option>
        <option value="LEGENDARY">{t("chest_type_legendary")}</option>
      </FilterSelect>

      <FilterSelect
        value={selectedYear ?? ""}
        onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null)}
      >
        <option value="">{t("filter_all_years")}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </FilterSelect>
    </FilterCard>
  );
}

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;
