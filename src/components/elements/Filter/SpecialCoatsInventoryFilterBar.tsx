"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/elements/Filter/Filter.styles";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface SpecialCoatsInventoryFilterBarProps {
  regions: Region[];
}

export default function SpecialCoatsInventoryFilterBar({
  regions,
}: SpecialCoatsInventoryFilterBarProps) {
  const tCommon = useTranslations("common");
  const tSpecialCoat = useTranslations("specialCoat");

  const filterRegionId = useSpecialCoatStore((state) => state.filterRegionId);
  const filterLevel10 = useSpecialCoatStore((state) => state.filterLevel10);
  const filterLevel20 = useSpecialCoatStore((state) => state.filterLevel20);
  const filterGlitter = useSpecialCoatStore((state) => state.filterGlitter);

  const setFilterRegionId = useSpecialCoatStore((state) => state.setFilterRegionId);
  const setFilterLevel10 = useSpecialCoatStore((state) => state.setFilterLevel10);
  const setFilterLevel20 = useSpecialCoatStore((state) => state.setFilterLevel20);
  const setFilterGlitter = useSpecialCoatStore((state) => state.setFilterGlitter);

  return (
    <Styles.FilterBar>
      <SelectBoxWithImage<Region>
        items={regions}
        selectedValue={filterRegionId !== null ? String(filterRegionId) : "all"}
        onSelectAction={(val) => setFilterRegionId(val === "all" ? null : Number(val))}
        allLabelKey="all_regions"
        getIdentifier={(region) => String(region.id)}
        getLabel={(region) => region.regionTexts[0]?.name ?? region.identifier}
        renderAllOption={() => (
          <RegionBadge
            image={{ path: "/images/icons/globus.png", name: "globus", alt: tCommon("filter.all_regions") }}
            size={28}
            showTooltip={true}
            tooltipLabel={tCommon("filter.all_regions")}
          />
        )}
        renderBadge={(region) => (
          <RegionBadge
            image={{
              path: `/images/regions/${region.identifier}/icon.jpg`,
              name: region.regionTexts[0]?.name ?? region.identifier,
              alt: region.regionTexts[0]?.name ?? region.identifier,
            }}
            size={28}
            showTooltip={true}
            tooltipLabel={region.regionTexts[0]?.name ?? region.identifier}
          />
        )}
      />

      <Styles.CheckboxLabel>
        <input
          type="checkbox"
          checked={filterLevel10}
          onChange={(e) => setFilterLevel10(e.target.checked)}
        />
        {tSpecialCoat("inventory.level10")}
      </Styles.CheckboxLabel>

      <Styles.CheckboxLabel>
        <input
          type="checkbox"
          checked={filterLevel20}
          onChange={(e) => setFilterLevel20(e.target.checked)}
        />
        {tSpecialCoat("inventory.level20")}
      </Styles.CheckboxLabel>

      <Styles.CheckboxLabel>
        <input
          type="checkbox"
          checked={filterGlitter}
          onChange={(e) => setFilterGlitter(e.target.checked)}
        />
        {tSpecialCoat("inventory.glitter_animal")}
      </Styles.CheckboxLabel>
    </Styles.FilterBar>
  );
}