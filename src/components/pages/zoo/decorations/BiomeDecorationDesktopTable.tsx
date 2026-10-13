"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteBiomeDecorationOnClient } from "@/service/frontend/BiomeDecoration";
import type { BiomeDecorationItem } from "./BiomeDecorationOverviewContent";

function toCurrencyType(pricetype: number): "Diamond" | "Zoodollar" {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface BiomeDecorationDesktopTableProps {
  decorations: BiomeDecorationItem[];
}

export default function BiomeDecorationDesktopTable({ decorations }: BiomeDecorationDesktopTableProps) {
  const t = useTranslations("decoration");
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
      await deleteBiomeDecorationOnClient(id);
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
          <th>{t("biome")}</th>
          <Styles.TableHeaderRight>{t("price")}</Styles.TableHeaderRight>
          <Styles.TableHeaderRight>{t("popularity")}</Styles.TableHeaderRight>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {decorations.map((deco) => {
          const name = deco.texts[0]?.name ?? deco.identifier;
          const imgSrc = `/images/biomes/${deco.biome.identifier}/decoration/${deco.identifier}/image.webp`;

          return (
            <tr key={deco.id}>
              <td>
                <Styles.TableThumbnail>
                  <img
                    src={imgSrc}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: "contain", borderRadius: 4 }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src.endsWith(".webp")) {
                        el.src = imgSrc.replace(".webp", ".jpg");
                      }
                    }}
                  />
                </Styles.TableThumbnail>
              </td>
              <td>
                <strong>{name}</strong>
              </td>
              <td>{deco.biome.identifier}</td>
              <Styles.TableCellRight>
                <CurrencyBadge value={deco.price} type={toCurrencyType(deco.pricetype)} />
              </Styles.TableCellRight>
              <Styles.TableCellRight>
                <PopularityCell>
                  <span>{deco.popularity}</span>
                  <Image src="/images/icons/visitors.jpg" alt="" width={16} height={16} style={{ objectFit: "contain", borderRadius: 2 }} />
                </PopularityCell>
              </Styles.TableCellRight>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={deco.id}
                    onEdit={() => router.push(`/zoo/decorations/${deco.id}/edit`)}
                    onDelete={() => handleDelete(deco.id)}
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

import styled from "styled-components";

const PopularityCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;
