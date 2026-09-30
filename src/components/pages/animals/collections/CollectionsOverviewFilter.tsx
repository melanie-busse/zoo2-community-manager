"use client";

import React from "react";

import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { StatueCheckbox } from "@/components/elements/Filter/StatueCheckbox";
import { DecorationCheckbox } from "@/components/elements/Filter/DecorationCheckbox";
import { useTranslations } from "next-intl";
import * as FilterStyles from "@/components/elements/Filter/Filter.styles";

const STARS = [1, 2, 3];

interface StarsItem {
  stars: number;
}

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface CollectionsOverviewFilterProps {
  regions: { id: number; identifier: string; name: string }[];
  selectedRegionId: number | null;
  onRegionChange: (id: number | null) => void;
  selectedStars: number | null;
  onStarsChange: (stars: number | null) => void;
  animalSearch: string;
  onAnimalSearchChange: (value: string) => void;
  onlyWithStatue: boolean;
  onOnlyWithStatueChange: (checked: boolean) => void;
  onlyWithDecoration: boolean;
  onOnlyWithDecorationChange: (checked: boolean) => void;
  onlyCompleted?: boolean;
  onOnlyCompletedChange?: (checked: boolean) => void;
  onlyOpen?: boolean;
  onOnlyOpenChange?: (checked: boolean) => void;
}

export default function CollectionsOverviewFilter({
  regions,
  selectedRegionId,
  onRegionChange,
  selectedStars,
  onStarsChange,
  animalSearch,
  onAnimalSearchChange,
  onlyWithStatue,
  onOnlyWithStatueChange,
  onlyWithDecoration,
  onOnlyWithDecorationChange,
  onlyCompleted,
  onOnlyCompletedChange,
  onlyOpen,
  onOnlyOpenChange,
}: CollectionsOverviewFilterProps) {
  const starsItems: StarsItem[] = STARS.map((stars) => ({ stars }));

  const regionItems: Region[] = regions.map((r) => ({
    id: r.id,
    identifier: r.identifier,
    regionTexts: [{ name: r.name }],
  }));

  const t = useTranslations("collections");
  const tCommon = useTranslations("common");

  return (
    <FilterCard>
      <FilterRow>
        <SearchInputField
          value={animalSearch}
          onChange={onAnimalSearchChange}
          placeholder={t("filter.animal_search")}
        />
        <RegionSelect
          regions={regionItems}
          selectedRegionId={selectedRegionId}
          onChange={onRegionChange}
        />
        <SelectBoxWithImage<StarsItem>
          items={starsItems}
          selectedValue={selectedStars !== null ? String(selectedStars) : "all"}
          onSelectAction={(val) => onStarsChange(val === "all" ? null : Number(val))}
          allLabelKey="all_stars"
          getIdentifier={(item) => String(item.stars)}
          getLabel={(item) => "★".repeat(item.stars)}
          renderBadge={() => null}
        />
      </FilterRow>
      <FilterRow>
        <StatueCheckbox checked={onlyWithStatue} onChange={onOnlyWithStatueChange} />
        <DecorationCheckbox checked={onlyWithDecoration} onChange={onOnlyWithDecorationChange} />
        {onOnlyCompletedChange !== undefined && (
          <FilterStyles.CheckboxLabel>
            <input type="checkbox" checked={!!onlyCompleted} onChange={(e) => onOnlyCompletedChange(e.target.checked)} />
            {tCommon("filter.only_completed_collections")}
          </FilterStyles.CheckboxLabel>
        )}
        {onOnlyOpenChange !== undefined && (
          <FilterStyles.CheckboxLabel>
            <input type="checkbox" checked={!!onlyOpen} onChange={(e) => onOnlyOpenChange(e.target.checked)} />
            {tCommon("filter.only_open_collections")}
          </FilterStyles.CheckboxLabel>
        )}
      </FilterRow>
    </FilterCard>
  );
}
