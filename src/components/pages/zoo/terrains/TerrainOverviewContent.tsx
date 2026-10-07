"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteTerrainOnClient } from "@/service/frontend/Terrain";

interface Terrain {
  id: number;
  identifier: string;
  terrainTexts: { name: string }[];
  regionName?: string | null;
}

interface TerrainOverviewContentProps {
  terrains: Terrain[];
}

export default function TerrainOverviewContent({ terrains }: TerrainOverviewContentProps) {
  const t = useTranslations("terrain");
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
      await deleteTerrainOnClient(id);
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
          <th>{t("region")}</th>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {terrains.map((terrain) => {
          const name = terrain.terrainTexts[0]?.name ?? terrain.identifier;
          const imgSrc = `/images/biomes/${terrain.identifier}/area.webp`;
          return (
            <tr key={terrain.id}>
              <td>
                <Styles.TableThumbnail>
                  <Image
                    src={imgSrc}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                </Styles.TableThumbnail>
              </td>
              <td>
                <strong>{name}</strong>
              </td>
              <td>{terrain.regionName ?? "—"}</td>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={terrain.id}
                    onEdit={() => router.push(`/zoo/terrains/${terrain.id}/edit`)}
                    onDelete={() => handleDelete(terrain.id)}
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
