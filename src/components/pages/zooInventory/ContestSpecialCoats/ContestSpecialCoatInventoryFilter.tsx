import { useContestSpecialCoatStore } from "@/store/useContestSpecialCoatStore";
import FilterCard from "@/components/elements/Filter/FilterCard";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";
import { useTranslations } from "next-intl";

interface ContestSpecialCoatInventoryFilterProps {
  regions: any[];
}

export default function ContestSpecialCoatInventoryFilter({
  regions,
}: ContestSpecialCoatInventoryFilterProps) {
  const tCommon = useTranslations("common");

  const allCoats = useContestSpecialCoatStore((state) => state.allCoats);
  const searchTerm = useContestSpecialCoatStore((state) => state.searchTerm);
  const setSearchTerm = useContestSpecialCoatStore((state) => state.setSearchTerm);
  const selectedBiome = useContestSpecialCoatStore((state) => state.selectedBiome);
  const setSelectedBiome = useContestSpecialCoatStore((state) => state.setSelectedBiome);
  const filterRegionId = useContestSpecialCoatStore((state) => state.filterRegionId);
  const setFilterRegionId = useContestSpecialCoatStore((state) => state.setFilterRegionId);

  const coatsWithBiome = allCoats.map((coat) => ({ ...coat, biome: coat.animal?.biome ?? null }));

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <BiomeSelect
        items={coatsWithBiome}
        selectedBiome={selectedBiome}
        onChange={setSelectedBiome}
      />
      <RegionSelect
        regions={regions}
        selectedRegionId={filterRegionId}
        onChange={setFilterRegionId}
      />
    </FilterCard>
  );
}
