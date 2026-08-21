"use client";

import React from "react";
import { useTranslations } from "next-intl";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useContestSpecialCoatStore } from "@/store/useContestSpecialCoatStore";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

type ContestCoatInventoryMap = Record<
  number,
  {
    puzzlePieces: number | null;
    regionId: number | null;
  }
>;

interface ContestSpecialCoatInventoryDesktopTableProps {
  inventoryState: ContestCoatInventoryMap;
  regions: Region[];
  onInventoryChange: (
    specialCoatId: number,
    field: "puzzlePieces" | "regionId",
    value: number | null,
  ) => void;
}

export default function ContestSpecialCoatInventoryDesktopTable({
  inventoryState,
  regions,
  onInventoryChange,
}: ContestSpecialCoatInventoryDesktopTableProps) {
  const tSpecialCoat = useTranslations("specialCoat");
  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");

  const coats = useContestSpecialCoatStore((state) => state.currentItems);
  const sortBy = useContestSpecialCoatStore((state) => state.sortBy);
  const sortDirection = useContestSpecialCoatStore((state) => state.sortDirection);
  const toggleSort = useContestSpecialCoatStore((state) => state.toggleSort);

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <SortableTableHeader
            label={tSpecialCoat("species")}
            onSort={() => toggleSort("coatName")}
            columnKey="coatName"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <Styles.TableCellRight>{tAnimal("statue.puzzle_pieces")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.region")}</Styles.TableCellRight>
        </tr>
      </thead>
      <tbody>
        {coats.length > 0 ? (
          coats.map((coat) => {
            const item = inventoryState[coat.id];
            const currentPuzzlePieces = item?.puzzlePieces ?? null;
            const currentRegionId = item?.regionId ?? null;

            return (
              <LinkedRow key={coat.id} path={`/specialcoats/${coat.id}`}>
                <td>
                  <Styles.TableThumbnail>
                    <ThumbnailBadge
                      image={getSpecialCoatImage(coat)}
                      biome={coat.animal?.biome}
                      name={coat.specialcoatstext?.[0]?.name ?? ""}
                    />
                  </Styles.TableThumbnail>
                </td>
                <td>
                  <strong>
                    {coat.specialcoatstext?.[0]?.name ?? tSpecialCoat("noName")}
                  </strong>
                  <br />
                  <span>{coat.specialcoatstext?.[0]?.color ?? tSpecialCoat("noColor")}</span>
                </td>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="number"
                    min={0}
                    value={currentPuzzlePieces ?? ""}
                    onChange={(e) =>
                      onInventoryChange(
                        coat.id,
                        "puzzlePieces",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    style={{
                      width: "70px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      textAlign: "right",
                    }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <SelectBoxWithImage<Region>
                    items={regions}
                    selectedValue={currentRegionId !== null ? String(currentRegionId) : "all"}
                    onSelectAction={(val) =>
                      onInventoryChange(
                        coat.id,
                        "regionId",
                        val === "all" ? null : Number(val),
                      )
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
