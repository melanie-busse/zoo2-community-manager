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
import { deleteOriginOnClient } from "@/service/frontend/Origin";
import type { OriginItem } from "./OriginOverviewContent";

interface OriginDesktopTableProps {
  origins: OriginItem[];
}

export default function OriginDesktopTable({ origins }: OriginDesktopTableProps) {
  const t = useTranslations("origin");
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
      await deleteOriginOnClient(id);
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
          <th></th>
          <th>{t("name")}</th>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {origins.map((origin) => {
          const name = origin.origintext[0]?.originName ?? origin.identifier ?? "-";
          const imgSrc = `/images/origins/${origin.identifier}/image.png`;

          return (
            <tr key={origin.id}>
              <td>
                <Styles.TableThumbnail>
                  {origin.identifier && (
                    <img
                      src={imgSrc}
                      alt={name}
                      width={64}
                      height={64}
                      style={{ objectFit: "contain", borderRadius: 4 }}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src.endsWith(".png")) {
                          el.src = el.src.replace(".png", ".jpg");
                        } else if (el.src.endsWith(".jpg")) {
                          el.src = el.src.replace(".jpg", ".webp");
                        } else {
                          el.style.display = "none";
                        }
                      }}
                    />
                  )}
                </Styles.TableThumbnail>
              </td>
              <td>
                <strong>{name}</strong>
              </td>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={origin.id}
                    onEdit={() => router.push(`/zoo/origins/${origin.id}/edit`)}
                    onDelete={() => handleDelete(origin.id)}
                  />
                </Styles.TableCellRight>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
