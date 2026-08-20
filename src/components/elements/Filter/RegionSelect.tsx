"use client";

import React from "react";
import { useTranslations } from "next-intl";

import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface RegionSelectProps {
  regions: Region[];
  selectedRegionId: number | null;
  onChange: (id: number | null) => void;
}

export function RegionSelect({ regions, selectedRegionId, onChange }: RegionSelectProps) {
  const tCommon = useTranslations("common");

  return (
    <SelectBoxWithImage<Region>
      items={regions}
      selectedValue={selectedRegionId !== null ? String(selectedRegionId) : "all"}
      onSelectAction={(val) => onChange(val === "all" ? null : Number(val))}
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
            path: `/images/regions/${region.identifier.toLowerCase()}/icon.jpg`,
            name: region.regionTexts[0]?.name ?? region.identifier,
            alt: region.regionTexts[0]?.name ?? region.identifier,
          }}
          size={28}
          showTooltip={true}
          tooltipLabel={region.regionTexts[0]?.name ?? region.identifier}
        />
      )}
    />
  );
}