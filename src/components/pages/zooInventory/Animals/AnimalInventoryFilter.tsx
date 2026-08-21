import { useAnimalStore } from "@/store/useAnimalStore";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { StatueCheckbox } from "@/components/elements/Filter/StatueCheckbox";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";
import { Level10Checkbox } from "@/components/elements/Filter/Level10Checkbox";
import { Level20Checkbox } from "@/components/elements/Filter/Level20Checkbox";
import { GlitterCheckbox } from "@/components/elements/Filter/GlitterCheckbox";
import { useTranslations } from "next-intl";

interface AnimalInventoryFilterProps {
  regions: any[];
}

export default function AnimalInventoryFilter({ regions }: AnimalInventoryFilterProps) {
  const tCommon = useTranslations("common");

  const allAnimals = useAnimalStore((state) => state.allAnimals);
  const searchTerm = useAnimalStore((state) => state.searchTerm);
  const setSearchTerm = useAnimalStore((state) => state.setSearchTerm);
  const selectedBiome = useAnimalStore((state) => state.selectedBiome);
  const setSelectedBiome = useAnimalStore((state) => state.setSelectedBiome);
  const selectedShelterLevel = useAnimalStore((state) => state.selectedShelterLevel);
  const setSelectedShelterLevel = useAnimalStore((state) => state.setSelectedShelterLevel);
  const hasStatueFilter = useAnimalStore((state) => state.hasStatueFilter);
  const setHasStatueFilter = useAnimalStore((state) => state.setHasStatueFilter);
  const filterRegionId = useAnimalStore((state) => state.filterRegionId);
  const setFilterRegionId = useAnimalStore((state) => state.setFilterRegionId);
  const filterLevel10 = useAnimalStore((state) => state.filterLevel10);
  const filterLevel20 = useAnimalStore((state) => state.filterLevel20);
  const filterGlitter = useAnimalStore((state) => state.filterGlitter);
  const setFilterLevel10 = useAnimalStore((state) => state.setFilterLevel10);
  const setFilterLevel20 = useAnimalStore((state) => state.setFilterLevel20);
  const setFilterGlitter = useAnimalStore((state) => state.setFilterGlitter);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <FilterRow>
        <BiomeSelect items={allAnimals} selectedBiome={selectedBiome} onChange={setSelectedBiome} />
        <ShelterLevelSelect
          items={allAnimals}
          selectedShelterLevel={selectedShelterLevel}
          onChange={(val) => setSelectedShelterLevel(val !== null ? String(val) : null)}
        />
        <RegionSelect
          regions={regions}
          selectedRegionId={filterRegionId}
          onChange={setFilterRegionId}
        />
      </FilterRow>
      <FilterRow>
        <StatueCheckbox checked={hasStatueFilter} onChange={setHasStatueFilter} />
        <Level10Checkbox checked={filterLevel10} onChange={setFilterLevel10} />
        <Level20Checkbox checked={filterLevel20} onChange={setFilterLevel20} />
        <GlitterCheckbox checked={filterGlitter} onChange={setFilterGlitter} />
      </FilterRow>
    </FilterCard>
  );
}