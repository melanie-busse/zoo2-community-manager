"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestDesktopTable from "@/components/pages/Contests/ContestOverview/ContestDesktopTable";
import { Contest } from "@/types/contest";
import ContestMobileCard from "@/components/pages/Contests/ContestOverview/ContestMobileCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import * as Styles from "@/components/pages/Contests/ContestOverview/ContestOverview.styles";
import React from "react";
import { useRouter } from "@/i18n/routing";

interface ContestOverviewContentProps {
  contests: Contest[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

export default function ContestOverviewContent({
  contests,
  handleEdit,
  handleDelete,
}: ContestOverviewContentProps) {
  const router = useRouter();
  const tContest = useTranslations("contest");

  return (
    <>
      <PageHeader text={tContest("contestOverview.overview_title")} />

      {contests.length > 0 ? (
        <>
          <Styles.DesktopOnly>
            <ContestDesktopTable contests={contests} onEdit={handleEdit} onDelete={handleDelete} />
          </Styles.DesktopOnly>

          <Styles.MobileOnly>
            {contests.map((contest) => (
              <ContestMobileCard
                key={contest.id}
                contest={contest}
                onClick={() => router.push(`/contests/${contest.id}`)}
                onEdit={() => handleEdit(String(contest.id))}
                onDelete={() => handleDelete(String(contest.id))}
              />
            ))}
          </Styles.MobileOnly>
        </>
      ) : (
        <EmptyState object="contests" onResetAction={() => router.refresh()} />
      )}
    </>
  );
}
