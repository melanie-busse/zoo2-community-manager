"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { Animal } from "@/types/animal";
import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import BiomeBadge from "@/components/ui/badges/BiomeBadge";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import ShelterLevelBadge from "@/components/ui/badges/ShelterLevelBadge";
import XPBadge from "@/components/ui/badges/XPBadge";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import Table from "@/components/page-structure/Table/Table";
import { calculateTotalXP } from "@/util/AnimalUtil";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";

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
            label="XP"
            onSort={() => onSort("xp")}
            columnKey="xp"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />
          {isAdmin && <th style={{ textAlign: "right" }}>{t("Common.actions")}</th>}
        </tr>
      </thead>
      <tbody>
        {animals.length > 0 ? (
          animals.map((animal) => (
            <tr key={animal.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ThumbnailBadge
                    image={animal.image}
                    category={`animals/${animal.category}`}
                    name={animal.name}
                  />
                  <strong>{animal.name}</strong>
                </div>
              </td>
              <td>
                <BiomeBadge type={animal.category} tooltipLabel={animal.biomeName} />
              </td>
              <td style={{ textAlign: "right" }}>
                <CurrencyBadge value={animal.price} type={animal.priceType?.name as CurrencyType} />
              </td>
              <td>
                <ShelterLevelBadge level={animal.shelterLevel} habitat={animal.category} />
              </td>
              <td style={{ textAlign: "right", paddingRight: "20px" }}>
                <XPBadge label={calculateTotalXP(animal)} />
              </td>
              {isAdmin && (
                <td style={{ textAlign: "right" }}>
                  <ActionGroupBadge object={animal} onEdit={onEdit} onDelete={onDelete} />
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "40px" }}>
              {t("EmptyState.title")} 🐾
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
