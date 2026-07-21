"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Filter/Filter.styles";

type FilterValue = "all" | "missing" | "imported" | "needs_update";

interface WikiDashboardFilterBarProps {
  filter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
}

export default function WikiDashboardFilterBar({ filter, onFilterChange }: WikiDashboardFilterBarProps) {
  const t = useTranslations("admin");

  return (
    <Styles.FilterBar>
      <Styles.FilterButton $active={filter === "all"} onClick={() => onFilterChange("all")}>
        {t("filter_all")}
      </Styles.FilterButton>

      <Styles.FilterButton $active={filter === "missing"} onClick={() => onFilterChange("missing")}>
        {t("filter_missing")}
      </Styles.FilterButton>

      <Styles.FilterButton $active={filter === "imported"} onClick={() => onFilterChange("imported")}>
        {t("filter_in_db")}
      </Styles.FilterButton>

      <Styles.FilterButton $active={filter === "needs_update"} onClick={() => onFilterChange("needs_update")}>
        {t("filter_needs_update")}
      </Styles.FilterButton>
    </Styles.FilterBar>
  );
}