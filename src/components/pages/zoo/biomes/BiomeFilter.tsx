"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useBiomeStore } from "@/store/useBiomeStore";

export default function BiomeFilter() {
  const t = useTranslations("biome");
  const searchTerm = useBiomeStore((state) => state.searchTerm);
  const setSearchTerm = useBiomeStore((state) => state.setSearchTerm);

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
