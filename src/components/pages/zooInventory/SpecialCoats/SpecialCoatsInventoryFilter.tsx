import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { ContestOnlyCheckbox } from "@/components/elements/Filter/ContestOnlyCheckbox";
import { Level20Checkbox } from "@/components/elements/Filter/Level20Checkbox";
import { GlitterCheckbox } from "@/components/elements/Filter/GlitterCheckbox";
import { Level10Checkbox } from "@/components/elements/Filter/Level10Checkbox";
import { RegionSelect } from "@/components/elements/Filter/RegionSelect";
import { ShelterLevelSelect } from "@/components/elements/Filter/ShelterLevelSelect";
import { BiomeSelect } from "@/components/elements/Filter/BiomeSelect";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import { useTranslations } from "next-intl";

export default function SpecialCoatsInventoryFilter({ regions }: { regions: any[] }) {
  const tCommon = useTranslations("common");

  const searchTerm = useSpecialCoatStore((state) => state.searchTerm);
  const setSearchTerm = useSpecialCoatStore((state) => state.setSearchTerm);
  const selectedBiome = useSpecialCoatStore((state) => state.selectedBiome);
  const setSelectedBiome = useSpecialCoatStore((state) => state.setSelectedBiome);
  const selectedShelterLevel = useSpecialCoatStore((state) => state.selectedShelterLevel);
  const setSelectedShelterLevel = useSpecialCoatStore((state) => state.setSelectedShelterLevel);
  const allSpecialCoats = useSpecialCoatStore((state) => state.allSpecialCoats);
  const contestOnly = useSpecialCoatStore((state) => state.contestOnly);
  const setContestOnly = useSpecialCoatStore((state) => state.setContestOnly);
  const filterRegionId = useSpecialCoatStore((state) => state.filterRegionId);
  const setFilterRegionId = useSpecialCoatStore((state) => state.setFilterRegionId);
  const filterLevel10 = useSpecialCoatStore((state) => state.filterLevel10);
  const filterLevel20 = useSpecialCoatStore((state) => state.filterLevel20);
  const filterGlitter = useSpecialCoatStore((state) => state.filterGlitter);
  const setFilterLevel10 = useSpecialCoatStore((state) => state.setFilterLevel10);
  const setFilterLevel20 = useSpecialCoatStore((state) => state.setFilterLevel20);
  const setFilterGlitter = useSpecialCoatStore((state) => state.setFilterGlitter);

  return (
    <FilterCard>
      <SearchInputField
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={tCommon("filter.search_placeholder")}
      />
      <FilterRow>
        <BiomeSelect
          items={allSpecialCoats.map((c) => ({ biome: c.animal?.biome }))}
          selectedBiome={selectedBiome}
          onChange={setSelectedBiome}
        />
        <ShelterLevelSelect
          items={allSpecialCoats.map((c) => ({ shelterLevel: c.animal?.shelterLevel }))}
          selectedShelterLevel={selectedShelterLevel}
          onChange={(val) => setSelectedShelterLevel(val !== null ? Number(val) : null)}
        />
        <RegionSelect
          regions={regions}
          selectedRegionId={filterRegionId}
          onChange={setFilterRegionId}
        />
      </FilterRow>

      <FilterRow>
        <ContestOnlyCheckbox checked={contestOnly} onChange={setContestOnly} />
        <Level10Checkbox checked={filterLevel10} onChange={setFilterLevel10} />
        <Level20Checkbox checked={filterLevel20} onChange={setFilterLevel20} />
        <GlitterCheckbox checked={filterGlitter} onChange={setFilterGlitter} />
      </FilterRow>
    </FilterCard>
  );
}
