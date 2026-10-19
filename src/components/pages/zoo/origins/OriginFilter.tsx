"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useOriginStore } from "@/store/useOriginStore";

export default function OriginFilter() {
  const t = useTranslations("origin");

  const searchTerm = useOriginStore((state) => state.searchTerm);
  const setSearchTerm = useOriginStore((state) => state.setSearchTerm);

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
