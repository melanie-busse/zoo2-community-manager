"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useGameStore } from "@/store/useGameStore";

export default function BiomeGameFilter() {
  const tCommon = useTranslations("common");

  const allGames = useGameStore((state) => state.allGames);
  const searchTerm = useGameStore((state) => state.searchTerm);
  const setSearchTerm = useGameStore((state) => state.setSearchTerm);
  const selectedBiomeIdentifier = useGameStore((state) => state.selectedBiomeIdentifier);
  const setSelectedBiomeIdentifier = useGameStore((state) => state.setSelectedBiomeIdentifier);

  const biomeOptions = useMemo(() => {
    const unique = [...new Set(allGames.map((g) => g.biomeIdentifier))].sort();
    return unique;
  }, [allGames]);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      {biomeOptions.length > 1 && (
        <BiomeSelect
          value={selectedBiomeIdentifier ?? "all"}
          onChange={(e) =>
            setSelectedBiomeIdentifier(e.target.value === "all" ? null : e.target.value)
          }
        >
          <option value="all">{tCommon("filter.all_biomes")}</option>
          {biomeOptions.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </BiomeSelect>
      )}
    </FilterCard>
  );
}

const BiomeSelect = styled.select`
  flex: 1;
  min-width: 180px;
  padding: 12px 16px;
  border: 2px solid rgba(224, 231, 213, 0.5);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[100]};
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;
