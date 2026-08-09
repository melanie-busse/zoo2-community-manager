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
          <Styles.ThPeriod>{tContest("contestOverview.table.period")}</Styles.ThPeriod>
          <th colSpan={3}>{tContest("contestOverview.table.statues_animals")}</th>
          <Styles.ThColorVariant>
            {tContest("contestOverview.table.colorVariant")}
          </Styles.ThColorVariant>
          <Styles.ThStatus>{tContest("contestOverview.table.status")}</Styles.ThStatus>
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
              <td>
                <Styles.DateWrapper>
                  <span>{startDateStr}</span>
                  <Styles.Divider>-</Styles.Divider>
                  <span>{endDateStr}</span>
                </Styles.DateWrapper>
              </td>

              <td colSpan={3}>
                <Styles.StatueRow>
                  {contest.conteststatue?.map((contestStatue) => {
                    return (
                      <Styles.AnimalCard key={contestStatue.id}>
                        {contestStatue.animal.image && (
                          <ThumbnailBadge
                            image={getAnimalImage(contestStatue.animal)}
                            name={contestStatue.animal.image}
                            biome={contestStatue.animal.biome}
                            size={55}
                          />
                        )}
                        <span>{getStatueName(contestStatue.animal, "unbekannte Statue")}</span>
                      </Styles.AnimalCard>
                    );
                  })}
                </Styles.StatueRow>
              </td>

              <Styles.TdColorVariant>
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
              </Styles.TdColorVariant>

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
