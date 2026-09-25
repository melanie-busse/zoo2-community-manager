import { useStatueStore } from "@/store/useStatueStore";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";
import { PuzzleStatusSelect } from "@/components/elements/Filter/PuzzleStatusSelect";
import { useTranslations } from "next-intl";

interface StatueInventoryFilterProps {
  regions: any[];
}

export default function StatueInventoryFilter({ regions }: StatueInventoryFilterProps) {
  const tCommon = useTranslations("common");

  const allStatues = useStatueStore((state) => state.allStatues);
  const searchTerm = useStatueStore((state) => state.searchTerm);
  const setSearchTerm = useStatueStore((state) => state.setSearchTerm);
  const selectedBiome = useStatueStore((state) => state.selectedBiome);
  const setSelectedBiome = useStatueStore((state) => state.setSelectedBiome);
  const filterRegionId = useStatueStore((state) => state.filterRegionId);
  const setFilterRegionId = useStatueStore((state) => state.setFilterRegionId);
  const filterPuzzleStatus = useStatueStore((state) => state.filterPuzzleStatus);
  const setFilterPuzzleStatus = useStatueStore((state) => state.setFilterPuzzleStatus);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <BiomeSelect items={allStatues} selectedBiome={selectedBiome} onChange={setSelectedBiome} />
      <RegionSelect
        regions={regions}
        selectedRegionId={filterRegionId}
        onChange={setFilterRegionId}
      />
      <PuzzleStatusSelect value={filterPuzzleStatus} onChange={setFilterPuzzleStatus} />
    </FilterCard>
  );
}
