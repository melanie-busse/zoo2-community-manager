"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import SortableTableHeader from "@/components/page-structure/Table/SortableTableHeader";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteShopOnClient } from "@/service/frontend/Shop";
import type { ShopItem } from "@/store/useShopStore";
import { useShopStore } from "@/store/useShopStore";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

interface ShopDesktopTableProps {
  shops: ShopItem[];
}

export default function ShopDesktopTable({ shops }: ShopDesktopTableProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director");
  const sortBy = useShopStore((s) => s.sortBy);
  const sortDirection = useShopStore((s) => s.sortDirection);
  const toggleSort = useShopStore((s) => s.toggleSort);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteShopOnClient(id);
      toast.success(t("form.messages.deleteSuccess"));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 80 }}></th>
          <SortableTableHeader
            label={t("name")}
            columnKey="name"
            onSort={() => toggleSort("name")}
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />
          <th>{t("region")}</th>
          <Styles.TableHeaderRight>{t("build_cost")}</Styles.TableHeaderRight>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {shops.map((shop) => {
          const level0 = shop.levels.find((l) => l.level === 0);
          const regionId = shop.region?.identifier.toLowerCase();
          const imgSrc = regionId
            ? `/images/regions/${regionId}/shops/${shop.identifier}/image.jpg`
            : null;
          return (
            <LinkedRow key={shop.id} path={`/zoo/shops/${shop.id}`}>
              <td style={{ width: 80, padding: "4px 8px" }}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={shop.name}
                    width={72}
                    height={48}
                    style={{ objectFit: "cover", borderRadius: 6, display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </td>
              <td>
                <strong>{shop.texts?.[0]?.name ?? shop.name}</strong>
              </td>
              <td>
                {shop.region ? (
                  (shop.region.regionTexts?.[0]?.name ?? shop.region.identifier)
                ) : (
                  <em style={{ color: "#aaa" }}>{t("unassigned")}</em>
                )}
              </td>
              <Styles.TableCellRight>
                {level0 ? (
                  <CurrencyBadge value={level0.cost} type={toCurrencyType(level0.currency)} />
                ) : (
                  "—"
                )}
              </Styles.TableCellRight>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={shop.id}
                    onEdit={() => router.push(`/zoo/shops/${shop.id}/edit`)}
                    onDelete={() => handleDelete(shop.id)}
                  />
                </Styles.TableCellRight>
              )}
            </LinkedRow>
          );
        })}
      </tbody>
    </Table>
  );
}
