"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/page-structure/Table/Table.styles";

import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

interface SpecialCoatsDesktopTableProps {
  userInventory?: {
    specialCoatId: number;
    count: number;
    level10: boolean;
    level20: boolean;
    glitterAnimal: boolean;
    regionId: number | null;
  }[];
  regions?: Region[];
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

function buildInventoryMap(
  userInventory: SpecialCoatsDesktopTableProps["userInventory"],
): InventoryMap {
  return (userInventory ?? []).reduce<InventoryMap>((acc, item) => {
    acc[item.specialCoatId] = {
      count: item.count,
      level10: item.level10,
      level20: item.level20,
      glitterAnimal: item.glitterAnimal,
      regionId: item.regionId,
    };
    return acc;
  }, {});
}

export default function SpecialCoatsInventoryDesktopTable({
  userInventory = [],
  regions = [],
}: SpecialCoatsDesktopTableProps) {
  const tSpecialCoat = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const [inventoryState, setInventoryState] = useState<InventoryMap>(() =>
    buildInventoryMap(userInventory),
  );

  const specialCoats = useSpecialCoatStore((state) => state.currentItems);
  const sortBy = useSpecialCoatStore((state) => state.sortBy);
  const sortDirection = useSpecialCoatStore((state) => state.sortDirection);
  const toggleSort = useSpecialCoatStore((state) => state.toggleSort);
  const setSelectedSpecialCoat = useSpecialCoatStore((state) => state.setSelectedSpecialCoat);

  const handleChange = async (
    specialCoatId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal" | "regionId",
    value: number | boolean | null,
  ) => {
    setInventoryState((prev) => {
      const defaults = {
        count: 0,
        level10: false,
        level20: false,
        glitterAnimal: false,
        regionId: null,
      };
      const current = prev[specialCoatId] ?? defaults;
      return {
        ...prev,
        [specialCoatId]: { ...defaults, ...current, [field]: value },
      };
    });

    try {
      const response = await fetch("/api/zooInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialCoatId, field, value }),
      });

      if (!response.ok) {
        console.error("Fehler beim Speichern in der Datenbank");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Zoo-Inventars:", error);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <SortableTableHeader
            label={tSpecialCoat("species")}
            onSort={() => toggleSort("name")}
            columnKey="name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <Styles.TableCellRight>{tSpecialCoat("inventory.count")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tSpecialCoat("inventory.partner_needed")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tSpecialCoat("inventory.level10")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tSpecialCoat("inventory.level20")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tSpecialCoat("inventory.glitter_animal")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tSpecialCoat("inventory.region")}</Styles.TableCellRight>
        </tr>
      </thead>
      <tbody>
        {specialCoats.length > 0 ? (
          specialCoats.map((specialCoat) => {
            const item = inventoryState[specialCoat.id];
            const currentCount = item?.count ?? 0;
            const currentLevel10 = item?.level10 ?? false;
            const currentLevel20 = item?.level20 ?? false;
            const currentGlitter = item?.glitterAnimal ?? false;
            const currentRegionId = item?.regionId ?? null;

            return (
              <LinkedRow
                key={specialCoat.id}
                path={`/specialcoats/${specialCoat.id}`}
                onClick={() => setSelectedSpecialCoat(specialCoat)}
              >
                <td>
                  <Styles.TableThumbnail>
                    <ThumbnailBadge
                      image={getSpecialCoatImage(specialCoat)}
                      biome={specialCoat.animal?.biome}
                      name={specialCoat.specialcoatstext?.[0]?.name ?? ""}
                    />
                  </Styles.TableThumbnail>
                </td>
                <td>
                  <strong>
                    {specialCoat.specialcoatstext?.[0]?.name ?? tSpecialCoat("noName")}
                  </strong>
                  <br />
                  <span>{specialCoat.specialcoatstext?.[0]?.color ?? tSpecialCoat("noColor")}</span>
                </td>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <select
                    value={currentCount}
                    onChange={(e) => handleChange(specialCoat.id, "count", Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </Styles.TableCellRight>
                <Styles.TableCellRight>
                  <input
                    type="checkbox"
                    readOnly
                    checked={specialCoat.parentWithCoatNeeded ?? false}
                    style={{ width: "18px", height: "18px", cursor: "default" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentLevel10}
                    onChange={(e) => handleChange(specialCoat.id, "level10", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentLevel20}
                    onChange={(e) => handleChange(specialCoat.id, "level20", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={currentGlitter}
                    onChange={(e) =>
                      handleChange(specialCoat.id, "glitterAnimal", e.target.checked)
                    }
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <SelectBoxWithImage<Region>
                    items={regions}
                    selectedValue={currentRegionId !== null ? String(currentRegionId) : "all"}
                    onSelectAction={(val) =>
                      handleChange(specialCoat.id, "regionId", val === "all" ? null : Number(val))
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
                          path: `/images/regions/${region.identifier.charAt(0).toLowerCase() + region.identifier.slice(1)}/icon.jpg`,
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
