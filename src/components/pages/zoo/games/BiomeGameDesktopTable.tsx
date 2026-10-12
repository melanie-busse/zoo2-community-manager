"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import CurrencyBadge from "@/components/ui/badges/CurrencyBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { useRouter } from "@/i18n/routing";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import type { BiomeGame } from "./BiomeGameOverviewContent";

function toCurrencyType(pricetype: number): "Diamond" | "Zoodollar" {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface BiomeGameDesktopTableProps {
  games: BiomeGame[];
}

export default function BiomeGameDesktopTable({ games }: BiomeGameDesktopTableProps) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);

  const handleDelete = () => {
    toast.info(t("form.messages.deleteNotImplemented"));
  };

  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>{t("name")}</th>
          <Styles.TableHeaderRight>{t("price")}</Styles.TableHeaderRight>
          <Styles.TableHeaderRight>{t("repair")}</Styles.TableHeaderRight>
          {isAdmin && <Styles.TableHeaderRight>{tCommon("actions")}</Styles.TableHeaderRight>}
        </tr>
      </thead>
      <tbody>
        {games.map((game) => {
          const name = game.texts[0]?.name ?? game.identifier;
          const imgSrc = `/images/biomes/${game.biomeIdentifier}/game/${game.identifier}/image.jpg`;

          return (
            <tr key={game.id}>
              <td>
                <Styles.TableThumbnail>
                  <Image
                    src={imgSrc}
                    alt={name}
                    width={64}
                    height={64}
                    style={{ objectFit: "contain", borderRadius: 4 }}
                  />
                </Styles.TableThumbnail>
              </td>
              <td>
                <strong>{name}</strong>
              </td>
              <Styles.TableCellRight>
                <CurrencyBadge value={game.price} type={toCurrencyType(game.pricetype)} />
              </Styles.TableCellRight>
              <Styles.TableCellRight>
                <CurrencyBadge value={game.repair} type={toCurrencyType(game.repairpricetype)} />
              </Styles.TableCellRight>
              {isAdmin && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={game.id}
                    onEdit={() => router.push(`/zoo/games/${game.id}/edit`)}
                    onDelete={handleDelete}
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
