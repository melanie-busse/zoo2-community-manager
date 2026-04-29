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
import { Name } from "@/components/elements/Name/Name";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { StatusBadge } from "@/components/ui/badges/StatusBadge";

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
          <th>{t("Contest.contestOverview.table.period")}</th>
          <th>{t("Contest.contestOverview.table.statues_animals")}</th>
          <th>{t("Contest.contestOverview.table.status")}</th>
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
              <td>
                <Styles.StatueGroup>
                  {contest.conteststatue?.map((link) => {
                    const statue = link.statue;
                    const animal = statue.animal;

                    if (!animal) return null;

                    const animalname = animal.name || "Unbekannt";

                    return (
                      <Styles.AnimalCard key={link.id}>
                        <ThumbnailBadge
                          image={animal.image}
                          name={animalname}
                          size={65}
                          category={`animals/${(animal.category || "grassland").toLowerCase()}`}
                        />
                        <Styles.NameStack>
                          <Name>{animalname}</Name>
                          <Styles.SubText>{animal.biomeName}</Styles.SubText>
                        </Styles.NameStack>
                      </Styles.AnimalCard>
                    );
                  })}
                </Styles.StatueGroup>
              </td>

              {/* Status Badge */}
              <td>
                <StatusBadge isActive={isActive} />
              </td>

              {isAdmin && (
                <td style={{ textAlign: "right" }}>
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
