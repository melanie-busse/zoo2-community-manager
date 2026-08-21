"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useAnimalStore } from "@/store/useAnimalStore";
import { getAnimalImage } from "@/utils/AnimalUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

type InventoryMap = Record<
  number,
  {
    count: number;
    level10: boolean;
    level20: boolean;
    glitterAnimal: boolean;
    regionId: number | null;
  }
>;

interface AnimalInventoryDesktopTableProps {
  inventoryState: InventoryMap;
  regions: Region[];
  onInventoryChange: (
    animalId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
    value: number | boolean | null,
  ) => void;
}

export default function AnimalInventoryDesktopTable({
  inventoryState,
  regions,
  onInventoryChange,
}: AnimalInventoryDesktopTableProps) {
  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");

  const animals = useAnimalStore((state) => state.currentItems);
  const sortBy = useAnimalStore((state) => state.sortBy);
  const sortDirection = useAnimalStore((state) => state.sortDirection);
  const toggleSort = useAnimalStore((state) => state.toggleSort);
  const setSelectedAnimal = useAnimalStore((state) => state.setSelectedAnimal);

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <SortableTableHeader
            label={tAnimal("species")}
            onSort={() => toggleSort("name")}
            columnKey="name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <Styles.TableCellRight>{tAnimal("inventory.count")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.level10")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.level20")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.glitter_animal")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.region")}</Styles.TableCellRight>
        </tr>
      </thead>
      <tbody>
        {animals.length > 0 ? (
          animals.map((animal) => {
            const item = inventoryState[animal.id];
            const currentCount = item?.count ?? 0;
            const currentLevel10 = item?.level10 ?? false;
            const currentLevel20 = item?.level20 ?? false;
            const currentGlitter = item?.glitterAnimal ?? false;
            const currentRegionId = item?.regionId ?? null;

            return (
              <LinkedRow
                key={animal.id}
                path={`/animals/${animal.id}`}
                onClick={() => setSelectedAnimal(animal)}
              >
                <td>
                  <Styles.TableThumbnail>
                    <ThumbnailBadge
                      image={getAnimalImage(animal)}
                      biome={animal.biome}
                      name={animal.animaltext?.[0]?.animalName ?? ""}
                    />
                  </Styles.TableThumbnail>
                </td>
                <td>
                  <strong>{animal.animaltext?.[0]?.animalName ?? tAnimal("noName")}</strong>
                </td>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <select
                    value={currentCount}
                    onChange={(e) => onInventoryChange(animal.id, "count", Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentLevel10}
                    onChange={(e) => onInventoryChange(animal.id, "level10", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentLevel20}
                    onChange={(e) => onInventoryChange(animal.id, "level20", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentGlitter}
                    onChange={(e) => onInventoryChange(animal.id, "glitterAnimal", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <SelectBoxWithImage<Region>
                    items={regions}
                    selectedValue={currentRegionId !== null ? String(currentRegionId) : "all"}
                    onSelectAction={(val) =>
                      onInventoryChange(animal.id, "regionId", val === "all" ? null : Number(val))
                    }
                    allLabelKey="no_region"
                    showLabel={false}
                    compact={true}
                    renderAllBadge={() => (
                      <RegionBadge
                        image={{
                          path: "/images/icons/globus.png",
                          name: "globus",
                          alt: "Keine Region",
                        }}
                        size={40}
                        showTooltip={true}
                        tooltipLabel="Keine Region"
                      />
                    )}
                    getIdentifier={(region) => String(region.id)}
                    renderBadge={(region) => (
                      <RegionBadge
                        image={{
                          path: `/images/regions/${region.identifier.toLowerCase()}/icon.jpg`,
                          name: region.regionTexts[0]?.name ?? region.identifier,
                          alt: region.regionTexts[0]?.name ?? region.identifier,
                        }}
                        size={40}
                        showTooltip={true}
                        tooltipLabel={region.regionTexts[0]?.name ?? region.identifier}
                      />
                    )}
                  />
                </Styles.TableCellRight>
              </LinkedRow>
            );
          })
        ) : (
          <tr>
            <Styles.TableEmptyState>{tCommon("emptyState.title")} 🐾</Styles.TableEmptyState>
          </tr>
        )}
      </tbody>
    </Table>
  );
}