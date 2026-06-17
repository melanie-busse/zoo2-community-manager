"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import { Animal } from "@/types/animal";
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

interface AnimalDesktopTableProps {
  animals: Animal[];
  sortBy: string | null;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AnimalDesktopTable({
  animals,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: AnimalDesktopTableProps) {
  const t = useTranslations();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "Director";

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <SortableTableHeader
            label={t("Animals.species")}
            onSort={() => onSort("name")}
            columnKey="name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("Biome.enclosure")}
            onSort={() => onSort("biomeName")}
            columnKey="biomeName"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("Common.price")}
            onSort={() => onSort("price")}
            columnKey="price"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          <SortableTableHeader
            label={t("Biome.shelterLevel")}
            onSort={() => onSort("shelterLevel")}
            columnKey="shelterLevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <SortableTableHeader
            label={t("Common.selling_price")}
            onSort={() => onSort("sellingPrice")}
            columnKey="sellingPrice"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          <SortableTableHeader
            label="XP"
            onSort={() => onSort("xp")}
            columnKey="xp"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          {isAdmin && <Styles.TableCellRight>{t("Common.actions")}</Styles.TableCellRight>}
        </tr>
      </thead>
      <tbody>
        {animals.length > 0 ? (
          animals.map((animal) => (
            <LinkedRow key={animal.id} path={`/animals/${animal.id}`}>
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
                <strong>{animal.animaltext?.[0]?.animalName ?? "Kein Name vorhanden"}</strong>
              </td>
              <td>
                <BiomeBadge
                  image={getBiomeImage(animal.biome)}
                  tooltipLabel={getBiomeName(animal.biome, "unbekannter Biome")}
                />
              </td>
              <Styles.TableCellRight>
                <CurrencyBadge value={animal.price} type={animal.priceType?.name as CurrencyType} />
              </Styles.TableCellRight>
              <td>
                <ShelterLevelBadge
                  image={getShelterImage(animal.biome)}
                  level={animal.shelterLevel}
                  habitat={animal.biome.identifier}
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
                  <ActionGroupBadge object={animal} onEdit={onEdit} onDelete={onDelete} />
                </Styles.TableCellRight>
              )}
            </LinkedRow>
          ))
        ) : (
          <tr>
            <Styles.TableEmptyState colSpan={isAdmin ? 6 : 5}>
              {t("EmptyState.title")} 🐾
            </Styles.TableEmptyState>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
