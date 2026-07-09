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
import { useRouter } from "@/i18n/routing";

export default function SpecialCoatsDesktopTable() {
  const router = useRouter();
  const tSpecialCoat = useTranslations("specialCoat");
  const tBiome = useTranslations("biome");
  const tCommon = useTranslations("common");

  const setEditingSpecialCoat = useSpecialCoatStore((state) => state.setEditingSpecialCoat);
  const deleteSpecialCoat = useSpecialCoatStore((state) => state.deleteSpecialCoat);
  const { data: session } = useSession();

  const specialCoats = useSpecialCoatStore((state) => state.currentItems);
  const sortBy = useSpecialCoatStore((state) => state.sortBy);
  const sortDirection = useSpecialCoatStore((state) => state.sortDirection);
  const toggleSort = useSpecialCoatStore((state) => state.toggleSort);
  const setSelectedSpecialCoat = useSpecialCoatStore((state) => state.setSelectedSpecialCoat);

  const isAdmin = session?.user?.role === "Director";

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
          <SortableTableHeader
            label={tBiome("enclosure")}
            onSort={() => toggleSort("biomeName")}
            columnKey="biomeName"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={tBiome("shelterLevel")}
            onSort={() => toggleSort("shelterLevel")}
            columnKey="shelterLevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          {isAdmin && <Styles.TableCellRight>{tCommon("actions")}</Styles.TableCellRight>}
        </tr>
      </thead>
      <tbody>
        {specialCoats.length > 0 ? (
          specialCoats.map((specialCoat) => (
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
              <td>
                <BiomeBadge
                  image={getBiomeImage(specialCoat.animal?.biome)}
                  tooltipLabel={getBiomeName(specialCoat.animal?.biome, tBiome("noBiome"))}
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
                  <ActionGroupBadge
                    id={specialCoat.id}
                    onEdit={() => {
                      setEditingSpecialCoat(specialCoat);
                      router.push(`/specialcoats/${specialCoat.id}/edit`);
                    }}
                    onDelete={() => deleteSpecialCoat(specialCoat.id, tSpecialCoat, tCommon)}
                  />
                </Styles.TableCellRight>
              )}
            </LinkedRow>
          ))
        ) : (
          <tr>
            <Styles.TableEmptyState colSpan={isAdmin ? 8 : 7}>
              {tCommon("emptyState.title")} 🐾
            </Styles.TableEmptyState>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
