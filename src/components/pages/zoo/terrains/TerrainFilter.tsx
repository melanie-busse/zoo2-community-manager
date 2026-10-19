"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useTerrainStore } from "@/store/useTerrainStore";

export default function TerrainFilter() {
  const t = useTranslations("terrain");
  const searchTerm = useTerrainStore((state) => state.searchTerm);
  const setSearchTerm = useTerrainStore((state) => state.setSearchTerm);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t("search_placeholder")}
      />
    </FilterCard>
  );
}
