"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useStatueStore } from "@/store/useStatueStore";
import SelectBoxWithImage from "@/components/ui/form/SelectBoxWithImage";
import RegionBadge from "@/components/ui/badges/RegionBadge";

interface Region {
  id: number;
  identifier: string;
  regionTexts: { name: string }[];
}

type StatueInventoryMap = Record<
  number,
  {
    puzzlePieces: number | null;
    regionId: number | null;
  }
>;

interface StatueInventoryDesktopTableProps {
  inventoryState: StatueInventoryMap;
  regions: Region[];
  onInventoryChange: (
    animalId: number,
    field: "puzzlePieces" | "regionId",
    value: number | null,
  ) => void;
}

export default function StatueInventoryDesktopTable({
  inventoryState,
  regions,
  onInventoryChange,
}: StatueInventoryDesktopTableProps) {
  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");

  const statues = useStatueStore((state) => state.currentItems);
  const sortBy = useStatueStore((state) => state.sortBy);
  const sortDirection = useStatueStore((state) => state.sortDirection);
  const toggleSort = useStatueStore((state) => state.toggleSort);

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
          <Styles.TableCellRight>{tAnimal("statue.puzzle_pieces")}</Styles.TableCellRight>
          <Styles.TableCellRight>{tAnimal("inventory.region")}</Styles.TableCellRight>
        </tr>
      </thead>
      <tbody>
        {statues.length > 0 ? (
          statues.map((statue) => {
            const item = inventoryState[statue.id];
            const currentPuzzlePieces = item?.puzzlePieces ?? null;
            const currentRegionId = item?.regionId ?? null;

            return (
              <LinkedRow key={statue.id} path={`/animals/${statue.id}`}>
                <td>
                  <Styles.TableThumbnail>
                    {statue.statueImage ? (
                      <Image
                        src={`/images/statues/${statue.statueImage}`}
                        alt={statue.animaltext?.[0]?.animalName ?? ""}
                        width={48}
                        height={48}
                        style={{ objectFit: "contain" }}
                      />
                    ) : null}
                  </Styles.TableThumbnail>
                </td>
                <td>
                  <strong>{statue.animaltext?.[0]?.animalName ?? tAnimal("noName")}</strong>
                </td>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="number"
                    min={0}
                    value={currentPuzzlePieces ?? ""}
                    onChange={(e) =>
                      onInventoryChange(
                        statue.id,
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
                        statue.id,
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
