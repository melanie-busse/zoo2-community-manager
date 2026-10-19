"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteShopOnClient } from "@/service/frontend/Shop";
import type { ShopItem } from "@/store/useShopStore";

interface ShopDesktopTableProps {
  shops: ShopItem[];
}

export default function ShopDesktopTable({ shops }: ShopDesktopTableProps) {
  const t = useTranslations("shop");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director");

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
          <th>{t("name")}</th>
          <th>{t("region")}</th>
          <Styles.TableHeaderRight>{t("coins_per_client")}</Styles.TableHeaderRight>
          <Styles.TableHeaderRight>{t("levels")}</Styles.TableHeaderRight>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {shops.map((shop) => (
          <tr key={shop.id}>
            <td>
              <strong>{shop.name}</strong>
            </td>
            <td>{shop.region?.identifier ?? <em style={{ color: "#aaa" }}>{t("unassigned")}</em>}</td>
            <Styles.TableCellRight>
              {shop.coinsPerClient != null ? shop.coinsPerClient : "—"}
            </Styles.TableCellRight>
            <Styles.TableCellRight>{shop.levels.length}</Styles.TableCellRight>
            {isAdmin && (
              <Styles.TableCellRight>
                <ActionGroupBadge
                  id={shop.id}
                  onEdit={() => router.push(`/zoo/shops/${shop.id}/edit`)}
                  onDelete={() => handleDelete(shop.id)}
                />
              </Styles.TableCellRight>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
