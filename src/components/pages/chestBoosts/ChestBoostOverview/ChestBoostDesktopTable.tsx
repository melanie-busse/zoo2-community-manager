"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "@/i18n/routing";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import Table from "@/components/page-structure/Table/Table";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";

import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { formatLocaleDate } from "@/utils/DateUtil";
import type { ChestBoostListItem } from "@/types/chestBoost";

interface Props {
  items: ChestBoostListItem[];
  onDelete: (id: number) => void;
}

export default function ChestBoostDesktopTable({ items, onDelete }: Props) {
  const t = useTranslations("chestBoosts");
  const { data: session } = useSession();
  const router = useRouter();
  const locale = "de"; // used for date formatting

  const canEdit = hasMinimumRole(session, "Director") && !isMayor(session);

  const chestTypeLabel = (type: string) => {
    if (type === "EPIC") return t("chest_type_epic");
    if (type === "RETRO") return t("chest_type_retro");
    if (type === "LEGENDARY") return t("chest_type_legendary");
    return type;
  };

  return (
    <Styles.DesktopView>
      <Table>
        <thead>
          <tr>
            <th>{t("column_period")}</th>
            <th>{t("column_animal")}</th>
            <th>{t("column_chest_type")}</th>
            {canEdit && <Styles.TableHeaderRight>{t("column_actions")}</Styles.TableHeaderRight>}
          </tr>
        </thead>
        <tbody>
          {items.map((boost) => (
            <tr key={boost.id}>
              <td>
                {formatLocaleDate(boost.startDate, `${locale}-DE`)} –{" "}
                {formatLocaleDate(boost.endDate, `${locale}-DE`)}
              </td>
              <td>
                <AnimalCell>
                  <AnimalImageWrapper>
                    <Image
                      src={
                        boost.animal.identifier
                          ? `/images/animals/${boost.animal.biome.identifier}/${boost.animal.identifier}/image.jpg`
                          : "/images/placeholder.jpg"
                      }
                      alt={boost.animal.name}
                      width={40}
                      height={40}
                      style={{ objectFit: "contain", borderRadius: 4 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </AnimalImageWrapper>
                  <AnimalInfo>
                    <AnimalName>{boost.animal.name}</AnimalName>
                    <BiomeName>{boost.animal.biome.name}</BiomeName>
                  </AnimalInfo>
                </AnimalCell>
              </td>
              <td>
                <ChestTypeWrapper>
                  {chestTypeLabel(boost.chestType)}
                  {boost.isEvent && <EventBadge>{t("event_badge")}</EventBadge>}
                </ChestTypeWrapper>
              </td>
              {canEdit && (
                <Styles.TableCellRight>
                  <ActionGroupBadge
                    id={boost.id}
                    onEdit={() => router.push(`/game/chests/${boost.id}/edit` as any)}
                    onDelete={() => onDelete(boost.id)}
                  />
                </Styles.TableCellRight>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Styles.DesktopView>
  );
}

const AnimalCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AnimalImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
`;

const AnimalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AnimalName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const BiomeName = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.grey[100]};
`;

const ChestTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EventBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.accent.main};
  color: white;
`;
