"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestDesktopTable from "@/components/pages/contests/ContestOverview/ContestDesktopTable";
import { Contest } from "@/types/contest";
import ContestMobileCard from "@/components/pages/contests/ContestOverview/ContestMobileCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import * as Styles from "@/components/pages/contests/ContestOverview/ContestOverview.styles";
import React from "react";
import { useRouter } from "@/i18n/routing";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

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
  const { data: session } = useSession();
  const canViewDetail = hasMinimumRole(session, "Member") || isMayor(session);
  const tContest = useTranslations("contest");

  return (
    <>
      <PageHeader text={tContest("contestOverview.overview_title")} />

      {contests.length > 0 ? (
        <>
          <Styles.DesktopOnly>
            <ContestDesktopTable contests={contests} onEdit={handleEdit} onDelete={handleDelete} canViewDetail={canViewDetail} />
          </Styles.DesktopOnly>

          <Styles.MobileOnly>
            {contests.map((contest) => (
              <ContestMobileCard
                key={contest.id}
                contest={contest}
                onClick={canViewDetail ? () => router.push(`/contests/${contest.id}`) : undefined}
                onEdit={() => handleEdit(String(contest.id))}
                onDelete={() => handleDelete(String(contest.id))}
              />
            ))}
          </Styles.MobileOnly>
        </>
      ) : (
        <EmptyState object="contests" />
      )}
    </>
  );
}
