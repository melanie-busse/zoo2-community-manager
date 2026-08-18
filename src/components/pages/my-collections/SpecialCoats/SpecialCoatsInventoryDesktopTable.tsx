"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "@/components/page-structure/Table/Table.styles";

import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";
import { useRouter } from "@/i18n/routing";

interface SpecialCoatsDesktopTableProps {
  userInventory?: any[]; // Übergibt das geladene Inventar des Users
}

export default function SpecialCoatsInventoryDesktopTable({
  userInventory = [],
}: SpecialCoatsDesktopTableProps) {
  const router = useRouter();
  const tSpecialCoat = useTranslations("specialCoat");
  const tCommon = useTranslations("common");

  const { data: session } = useSession();

  const specialCoats = useSpecialCoatStore((state) => state.currentItems);
  const sortBy = useSpecialCoatStore((state) => state.sortBy);
  const sortDirection = useSpecialCoatStore((state) => state.sortDirection);
  const toggleSort = useSpecialCoatStore((state) => state.toggleSort);
  const setSelectedSpecialCoat = useSpecialCoatStore((state) => state.setSelectedSpecialCoat);

  // Handler zum Speichern der Änderungen in der Datenbank via API-Route
  const handleChange = async (
    specialCoatId: number,
    field: "count" | "level10" | "level20" | "glitterAnimal",
    value: any,
  ) => {
    try {
      const parsedValue = field === "count" ? Number(value) : Boolean(value);

      const response = await fetch("/api/zoo-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialCoatId,
          field,
          value: parsedValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern in der Datenbank");
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
          <SortableTableHeader
            label={tSpecialCoat("color")}
            onSort={() => toggleSort("color")}
            columnKey="color"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <Styles.TableCellRight>Anzahl Tiere</Styles.TableCellRight>
          <Styles.TableCellRight>Level 10</Styles.TableCellRight>
          <Styles.TableCellRight>Level 20</Styles.TableCellRight>
          <Styles.TableCellRight>Glitzertier</Styles.TableCellRight>
        </tr>
      </thead>
      <tbody>
        {specialCoats.length > 0 ? (
          specialCoats.map((specialCoat) => {
            // Finde den passenden Inventar-Eintrag des angemeldeten Users für diese Farbvariante
            const inventoryItem = userInventory.find((inv) => inv.specialCoatId === specialCoat.id);

            const currentCount = inventoryItem?.count ?? 0;
            const currentLevel10 = inventoryItem?.level10 ?? false;
            const currentLevel20 = inventoryItem?.level20 ?? false;
            const currentGlitter = inventoryItem?.glitterAnimal ?? false;

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
                </td>
                <td>
                  <strong>
                    {specialCoat.specialcoatstext?.[0]?.color ?? tSpecialCoat("noColor")}
                  </strong>
                </td>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <select
                    defaultValue={currentCount}
                    onChange={(e) => handleChange(specialCoat.id, "count", e.target.value)}
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
                    defaultChecked={currentLevel10}
                    onChange={(e) => handleChange(specialCoat.id, "level10", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    defaultChecked={currentLevel20}
                    onChange={(e) => handleChange(specialCoat.id, "level20", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </Styles.TableCellRight>
                <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    defaultChecked={currentGlitter}
                    onChange={(e) =>
                      handleChange(specialCoat.id, "glitterAnimal", e.target.checked)
                    }
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
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
