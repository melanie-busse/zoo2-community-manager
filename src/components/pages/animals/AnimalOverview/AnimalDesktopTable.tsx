"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "@/components/page-structure/Table/Table.styles";

import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import XPBadge from "@/components/ui/badges/XPBadge";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import { calculateTotalXP, getAnimalImage } from "@/utils/AnimalUtil";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { getBiomeImage, getBiomeName, getShelterImage } from "@/utils/BiomeUtil";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useRouter } from "@/i18n/routing";
import { TableCellRight, TableHeaderRight } from "@/components/page-structure/Table/Table.styles";

export default function AnimalDesktopTable() {
  const router = useRouter();
  const tAnimal = useTranslations("animal");
  const tBiome = useTranslations("biome");
  const tCommon = useTranslations("common");

  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const deleteAnimal = useAnimalStore((state) => state.deleteAnimal);
  const { data: session } = useSession();

  const animals = useAnimalStore((state) => state.currentItems);
  const sortBy = useAnimalStore((state) => state.sortBy);
  const sortDirection = useAnimalStore((state) => state.sortDirection);
  const toggleSort = useAnimalStore((state) => state.toggleSort);
  const setSelectedAnimal = useAnimalStore((state) => state.setSelectedAnimal);

  const isAdmin = session?.user?.role === "Director";

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
          <SortableTableHeader
            label={tBiome("enclosure")}
            onSort={() => toggleSort("biomeName")}
            columnKey="biomeName"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={tCommon("price")}
            onSort={() => toggleSort("price")}
            columnKey="price"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          <SortableTableHeader
            label={tBiome("shelterLevel")}
            onSort={() => toggleSort("shelterLevel")}
            columnKey="shelterLevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={tCommon("selling_price")}
            onSort={() => toggleSort("sellingPrice")}
            columnKey="sellingPrice"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          <SortableTableHeader
            label="XP"
            onSort={() => toggleSort("xp")}
            columnKey="xp"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          {isAdmin && <TableHeaderRight>{tCommon("actions")}</TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {animals.length > 0 ? (
          animals.map((animal) => (
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
              <td>
                <BiomeBadge
                  image={getBiomeImage(animal.biome)}
                  tooltipLabel={getBiomeName(animal.biome, tBiome("noBiome"))}
                />
              </td>
              <Styles.TableCellRight>
                <CurrencyBadge value={animal.price} type={animal.priceType?.name as CurrencyType} />
              </Styles.TableCellRight>
              <td>
                <ShelterLevelBadge
                  image={getShelterImage(animal.biome)}
                  level={animal.shelterLevel ?? 0}
                  habitat={animal.biome?.identifier}
                />
              </td>
              <Styles.TableCellRight>
                <CurrencyBadge value={animal.sellingPrice} type={"Zoodollar" as CurrencyType} />
              </Styles.TableCellRight>
              <Styles.TableCellRight>
                <XPBadge label={calculateTotalXP(animal)} />
              </Styles.TableCellRight>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={animal.id}
                    onEdit={() => {
                      setEditingAnimal(animal);
                      router.push(`/animals/${animal.id}/edit`);
                    }}
                    onDelete={() => {
                      deleteAnimal(animal.id, tAnimal, tCommon);
                    }}
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
