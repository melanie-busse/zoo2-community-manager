"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";

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
import styled from "styled-components";

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
  const t = useTranslations();
  const locale = useLocale();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <Table>
      <thead>
        <tr>
          <ThPeriod>{t("Contest.contestOverview.table.period")}</ThPeriod>
          <th colSpan={3}>{t("Contest.contestOverview.table.statues_animals")}</th>
          <th style={{ textAlign: "right", paddingRight: "50px" }}>
            {t("Contest.contestOverview.table.colorVariant")}
          </th>
          <ThStatus>{t("Contest.contestOverview.table.status")}</ThStatus>
          <ActionsHeadline text={t("Common.actions")} />
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

              {/* Die Statuen/Tiere */}
              <td colSpan={4}>
                <Styles.StatueGroup>
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
                </Styles.StatueGroup>
              </td>

              <td>
                <StatusBadge isActive={isActive} />
              </td>
              {isAdmin && (
                <td
                  style={{
                    textAlign: "right",
                    width: "1%",
                    whiteSpace: "nowrap",
                    paddingRight: "20px",
                  }}
                >
                  <ActionGroupBadge object={contest} onEdit={onEdit} onDelete={onDelete} />
                </td>
              )}
            </LinkedRow>
          );
        })}
      </tbody>
    </Table>
  );
}

const ThPeriod = styled.th`
  width: 110px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const ThStatus = styled.th`
  width: 100px;
  text-align: center;
`;
