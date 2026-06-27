"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "@/components/page-structure/Table/Table.styles";

import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { getBiomeImage, getBiomeName, getShelterImage } from "@/utils/BiomeUtil";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";

export default function SpecialCoatsDesktopTable() {
  const t = useTranslations();
  const { data: session } = useSession();

  const specialCoats = useSpecialCoatStore((state) => state.currentItems);
  const sortBy = useSpecialCoatStore((state) => state.sortBy);
  const sortDirection = useSpecialCoatStore((state) => state.sortDirection);
  const toggleSort = useSpecialCoatStore((state) => state.toggleSort);
  const setSelectedSpecialCoat = useSpecialCoatStore((state) => state.setSelectedSpecialCoat);

  console.log("specialCoats", specialCoats);
  const isAdmin = session?.user?.role === "Director";

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <SortableTableHeader
            label={t("SpecialCoats.species")}
            onSort={() => toggleSort("name")}
            columnKey="name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("SpecialCoats.color")}
            onSort={() => toggleSort("color")}
            columnKey="color"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("Biome.enclosure")}
            onSort={() => toggleSort("biomeName")}
            columnKey="biomeName"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("Biome.shelterLevel")}
            onSort={() => toggleSort("shelterLevel")}
            columnKey="shelterLevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          {isAdmin && <Styles.TableCellRight>{t("Common.actions")}</Styles.TableCellRight>}
        </tr>
      </thead>
      <tbody>
        {specialCoats.length > 0 ? (
          specialCoats.map((specialCoat) => (
            <LinkedRow
              key={specialCoat.id}
              path={`/specialCoats/${specialCoat.id}`}
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
                <strong>{specialCoat.specialcoatstext?.[0]?.name ?? "Kein Name vorhanden"}</strong>
              </td>
              <td>
                <strong>
                  {specialCoat.specialcoatstext?.[0]?.color ?? "Keine Farbe vorhanden"}
                </strong>
              </td>
              <td>
                <BiomeBadge
                  image={getBiomeImage(specialCoat.animal?.biome)}
                  tooltipLabel={getBiomeName(specialCoat.animal?.biome, "unbekannter Biome")}
                />
              </td>
              <td>
                <ShelterLevelBadge
                  image={getShelterImage(specialCoat.animal?.biome)}
                  level={specialCoat.animal?.shelterLevel || 0}
                  habitat={specialCoat.animal?.biome.identifier}
                />
              </td>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge object={specialCoat} />
                </Styles.TableCellRight>
              )}
            </LinkedRow>
          ))
        ) : (
          <tr>
            <Styles.TableEmptyState colSpan={isAdmin ? 8 : 7}>
              {t("EmptyState.title")} 🐾
            </Styles.TableEmptyState>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
