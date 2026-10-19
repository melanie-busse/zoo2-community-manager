"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useRegionStore } from "@/store/useRegionStore";

export default function RegionFilter() {
  const t = useTranslations("region");
  const searchTerm = useRegionStore((state) => state.searchTerm);
  const setSearchTerm = useRegionStore((state) => state.setSearchTerm);

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
