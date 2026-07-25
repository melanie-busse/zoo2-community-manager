"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import * as Styles from "./ContestOverview.styles";
import Table from "@/components/page-structure/Table/Table";
import LinkedRow from "@/components/page-structure/Table/LinkedRow";
import ActionsHeadline from "@/components/page-structure/Table/ActionsHeadline";
import { Contest } from "@/types/contest";
import ThumbnailBadge from "@/components/ui/badges/ThumbnailBadge";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { StatusBadge } from "@/components/ui/badges/StatusBadge";
import { getStatueName } from "@/utils/ContestUtil";
import { getAnimalImage } from "@/utils/AnimalUtil";
import { getSpecialCoatImage } from "@/utils/SpecialCoatUtil";

interface ContestDesktopTableProps {
  contests: Contest[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ContestDesktopTable({
  contests,
  onEdit,
  onDelete,
}: ContestDesktopTableProps) {
  const tContest = useTranslations("contest");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <Table>
      <thead>
        <tr>
          <ThPeriod>{tContest("contestOverview.table.period")}</ThPeriod>
          <th colSpan={3}>{tContest("contestOverview.table.statues_animals")}</th>
          <ThColorVariant>{tContest("contestOverview.table.colorVariant")}</ThColorVariant>
          <ThStatus>{tContest("contestOverview.table.status")}</ThStatus>
          <ActionsHeadline text={tCommon("actions")} />
        </tr>
      </thead>
      <tbody>
        {contests.map((contest) => {
          const start = new Date(contest.startDate);
          const end = new Date(contest.endDate);
          const now = new Date();

          const startDateStr = start.toLocaleDateString(locale, options);
          const endDateStr = end.toLocaleDateString(locale, options);

          const isActive = now >= start && now <= end;

          return (
            <LinkedRow key={contest.id} path={`/contests/${contest.id}`}>
              {/* Zeitraum */}
              <td>
                <Styles.DateWrapper>
                  <span>{startDateStr}</span>
                  <Styles.Divider>-</Styles.Divider>
                  <span>{endDateStr}</span>
                </Styles.DateWrapper>
              </td>

              {/* 3 Statuen nebeneinander in einer Zeile */}
              <td colSpan={3}>
                <Styles.StatueRow>
                  {contest.conteststatue?.map((contestStatue) => {
                    return (
                      <Styles.AnimalCard key={contestStatue.id}>
                        {contestStatue.statue.animal.image && (
                          <ThumbnailBadge
                            image={getAnimalImage(contestStatue.statue.animal)}
                            name={contestStatue.statue.animal.image}
                            biome={contestStatue.statue.animal.biome}
                            size={55}
                          />
                        )}
                        <span>{getStatueName(contestStatue.statue, "unbekannte Statue")}</span>
                      </Styles.AnimalCard>
                    );
                  })}
                </Styles.StatueRow>
              </td>

              {/* Farbvariante rechtsbündig ausgerichtet */}
              <TdColorVariant>
                <Styles.ColorVariantWrapper>
                  {contest.contestspecialcoat?.map((link) => {
                    const coat = link.specialcoat;
                    if (!coat) return null;
                    const name =
                      coat.specialcoatstext?.[0]?.name ||
                      coat.animal?.animaltext?.[0]?.animalName ||
                      `Coat #${coat.id}`;
                    return (
                      <Styles.AnimalCard key={link.id}>
                        <ThumbnailBadge
                          image={getSpecialCoatImage(coat)}
                          biome={coat.animal?.biome}
                          name={name}
                          size={55}
                        />
                        <span>{name}</span>
                      </Styles.AnimalCard>
                    );
                  })}
                </Styles.ColorVariantWrapper>
              </TdColorVariant>

              {/* Status */}
              <td>
                <StatusBadge isActive={isActive} />
              </td>

              {/* Aktionen */}
              {isAdmin && (
                <td
                  style={{
                    textAlign: "right",
                    width: "1%",
                    whiteSpace: "nowrap",
                    paddingRight: "20px",
                  }}
                >
                  <ActionGroupBadge
                    id={contest.id}
                    onEdit={() => onEdit(String(contest.id))}
                    onDelete={() => onDelete(String(contest.id))}
                  />
                </td>
              )}
            </LinkedRow>
          );
        })}
      </tbody>
    </Table>
  );
}

/* Tabellen-Styles für korrekte Ausrichtung */
const ThPeriod = styled.th`
  width: 110px;
  text-align: center;
`;

const ThStatus = styled.th`
  width: 100px;
  text-align: center;
`;

const ThColorVariant = styled.th`
  text-align: right;
  padding-right: 20px;
`;

const TdColorVariant = styled.td`
  padding-right: 20px;
`;
