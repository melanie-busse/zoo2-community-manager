"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { useRouter } from "@/i18n/routing";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteRegionOnClient } from "@/service/frontend/Region";

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
}

interface RegionDesktopTableProps {
  regions: Region[];
}

export default function RegionDesktopTable({ regions }: RegionDesktopTableProps) {
  const t = useTranslations("region");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDeleteDialog({
      title: t("form.messages.deleteErrorTitle"),
      text: t("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteRegionOnClient(id);
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
          <Styles.TableHeaderRight>{tCommon("price")}</Styles.TableHeaderRight>
          <th>{t("unlock_level")}</th>
          <th>{t("breeding_slots")}</th>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {regions.map((region) => {
          const name = region.regionTexts[0]?.name ?? region.identifier;
          const imgSrc = `/images/regions/${region.identifier}/icon.jpg`;
          return (
            <LinkedRow key={region.id} path={`/zoo/regions/${region.id}`}>
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
              <td><strong>{name}</strong></td>
              <Styles.TableCellRight>
                <CurrencyBadge value={region.price} type="Diamond" />
              </Styles.TableCellRight>
              <td>{t("level_value", { level: region.unlocklevel })}</td>
              <td>{region._count.breedingCenterSlots}</td>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={region.id}
                    onEdit={() => router.push(`/zoo/regions/${region.id}/edit`)}
                    onDelete={() => handleDelete(region.id)}
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
