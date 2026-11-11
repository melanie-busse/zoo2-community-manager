"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

interface Props {
  entries: PremiumVipAnimalEntryWithAnimal[];
  onRowClick: (entry: PremiumVipAnimalEntryWithAnimal) => void;
  editBasePath: string;
}

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border ?? "#e0e0e0"};
  color: ${({ theme }) => theme.colors.textSecondary ?? "#666"};
  font-weight: 600;
  white-space: nowrap;
`;

interface TrProps {
  $clickable: boolean;
}

const Tr = styled.tr<TrProps>`
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ $clickable, theme }) =>
      $clickable ? (theme.colors.hoverBackground ?? "rgba(0,0,0,0.04)") : "transparent"};
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border ?? "#e0e0e0"};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  vertical-align: middle;
`;

const AnimalCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const AnimalImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const AnimalImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border ?? "#e0e0e0"};
  flex-shrink: 0;
`;

const NpcBadge = styled.span`
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary ?? "#6c757d"};
  color: white;
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  vertical-align: middle;
`;

const ActionButton = styled.a<{ $disabled?: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  border: 1px solid ${({ theme, $disabled }) =>
    $disabled ? (theme.colors.border ?? "#e0e0e0") : (theme.colors.primary ?? "#0070f3")};
  color: ${({ theme, $disabled }) =>
    $disabled ? (theme.colors.textSecondary ?? "#999") : (theme.colors.primary ?? "#0070f3")};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  white-space: nowrap;
`;

const PeriodCell = styled.div`
  white-space: nowrap;
`;

const EmptyRow = styled.tr``;
const EmptyTd = styled.td`
  padding: ${({ theme }) => theme.spacing(3)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary ?? "#666"};
`;

export default function BonusAnimalsTable({ entries, onRowClick, editBasePath }: Props) {
  const t = useTranslations("animals_bonus");
  const locale = useLocale();
  const { data: session } = useSession();
  const canEdit = hasMinimumRole(session, "Director") && !isMayor(session);

  const colSpan = canEdit ? 4 : 3;

  if (entries.length === 0) {
    return (
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <Th>{t("col_period")}</Th>
              <Th>{t("col_animal")}</Th>
              <Th>{t("col_actions")}</Th>
              {canEdit && <Th />}
            </tr>
          </thead>
          <tbody>
            <EmptyRow>
              <EmptyTd colSpan={colSpan}>{t("no_results")}</EmptyTd>
            </EmptyRow>
          </tbody>
        </StyledTable>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th>{t("col_period")}</Th>
            <Th>{t("col_animal")}</Th>
            <Th>{t("col_actions")}</Th>
            {canEdit && <Th />}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isClickable = entry.animalId !== null && !entry.isNpc;
            const labelIncludesYear = entry.dateLabel.includes(String(entry.year));
            const periodText = labelIncludesYear
              ? entry.dateLabel
              : `${entry.dateLabel} ${entry.year}`;

            return (
              <Tr
                key={entry.id}
                $clickable={isClickable}
                onClick={() => isClickable && onRowClick(entry)}
              >
                <Td>
                  <PeriodCell>{periodText}</PeriodCell>
                </Td>
                <Td>
                  <AnimalCell>
                    {entry.animal?.identifier ? (
                      <AnimalImage
                        src={`/images/animals/${entry.animal.identifier}.webp`}
                        alt={entry.animalName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <AnimalImagePlaceholder />
                    )}
                    {entry.animalName}
                    {entry.isNpc && <NpcBadge>{t("npc_badge")}</NpcBadge>}
                  </AnimalCell>
                </Td>
                <Td>
                  {isClickable ? (
                    <ActionButton
                      as={Link}
                      href={`/${locale}/animals/${entry.animalId}`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {t("action_view")}
                    </ActionButton>
                  ) : (
                    <ActionButton $disabled>{t("action_view")}</ActionButton>
                  )}
                </Td>
                {canEdit && (
                  <Td>
                    <ActionButton
                      as={Link}
                      href={`/${locale}${editBasePath}/${entry.id}/edit`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {t("action_edit")}
                    </ActionButton>
                  </Td>
                )}
              </Tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}
