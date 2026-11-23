"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";

import * as Styles from "@/components/page-structure/Table/Table.styles";
import Table from "@/components/page-structure/Table/Table";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";

import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

interface Props {
  entries: PremiumVipAnimalEntryWithAnimal[];
  onRowClick: (entry: PremiumVipAnimalEntryWithAnimal) => void;
  editBasePath: string;
  onDelete?: (id: number) => void;
}

export default function BonusAnimalsTable({ entries, onRowClick, editBasePath, onDelete }: Props) {
  const t = useTranslations("animals_bonus");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();

  const canEdit = hasMinimumRole(session, "Director") && !isMayor(session);

  const getImageSrc = (entry: PremiumVipAnimalEntryWithAnimal) => {
    const identifier = entry.animal?.identifier;
    const biomeIdentifier = entry.animal?.biome?.identifier;

    if (identifier && biomeIdentifier) {
      return `/images/animals/${biomeIdentifier}/${identifier}/image.jpg`;
    }
    if (identifier) {
      return `/images/animals/${identifier}.webp`;
    }
    return "/images/placeholder.png";
  };

  return (
    <Styles.DesktopView>
      <Table>
        <thead>
          <tr>
            <th>{t("col_period")}</th>
            <th>{t("col_animal")}</th>
            {canEdit && <Styles.TableHeaderRight>{t("col_actions")}</Styles.TableHeaderRight>}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <EmptyTd colSpan={canEdit ? 3 : 2}>{t("no_results")}</EmptyTd>
            </tr>
          ) : (
            entries.map((entry) => {
              const isClickable = entry.animalId !== null && !entry.isNpc;
              const labelIncludesYear = entry.dateLabel.includes(String(entry.year));
              const periodText = labelIncludesYear
                ? entry.dateLabel
                : `${entry.dateLabel} ${entry.year}`;

              const displayName = entry.animalName;

              return (
                <ClickableRow
                  key={entry.id}
                  $clickable={isClickable}
                  onClick={() => isClickable && onRowClick(entry)}
                >
                  <td>
                    <PeriodText>{periodText}</PeriodText>
                  </td>
                  <td>
                    <AnimalCell>
                      <AnimalImageWrapper>
                        <AnimalImage
                          src={getImageSrc(entry)}
                          alt={displayName}
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            if (!img.src.endsWith("/images/placeholder.png")) {
                              img.src = "/images/placeholder.png";
                            }
                          }}
                        />
                      </AnimalImageWrapper>
                      <AnimalInfo>
                        <AnimalNameRow>
                          <AnimalName>{displayName}</AnimalName>
                          {entry.isNpc && <NpcBadge>{t("npc_badge")}</NpcBadge>}
                        </AnimalNameRow>
                      </AnimalInfo>
                    </AnimalCell>
                  </td>
                  {canEdit && (
                    <Styles.TableCellRight onClick={(e) => e.stopPropagation()}>
                      <ActionGroupBadge
                        id={entry.id}
                        onEdit={() =>
                          router.push(`/${locale}${editBasePath}/${entry.id}/edit` as any)
                        }
                        onDelete={() => onDelete?.(entry.id)}
                      />
                    </Styles.TableCellRight>
                  )}
                </ClickableRow>
              );
            })
          )}
        </tbody>
      </Table>
    </Styles.DesktopView>
  );
}

const ClickableRow = styled.tr<{ $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const PeriodText = styled.span`
  white-space: nowrap;
`;

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

const AnimalImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  display: block;
`;

const AnimalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AnimalNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AnimalName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const BiomeName = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.grey[100]};
`;

const NpcBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.accent.main};
  color: white;
`;

const EmptyTd = styled.td`
  padding: ${({ theme }) => theme.spacing(3)};
  text-align: center;
  color: ${({ theme }) => theme.colors.grey[100]};
`;
