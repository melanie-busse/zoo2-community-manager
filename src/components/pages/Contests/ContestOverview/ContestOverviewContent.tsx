"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ContestDesktopTable from "@/components/pages/Contests/ContestOverview/ContestDesktopTable";
import { Contest } from "@/types/contest";
import ContestMobileCard from "@/components/pages/Contests/ContestOverview/ContestMobileCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import React from "react";
import { useRouter } from "next/navigation";

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
  const t = useTranslations();

  return <p>läuft</p>;
  //   <>
  //     <PageHeader text={t("Contest.contestOverview.overview_title")} />
  //
  //     {contests.length > 0 ? (
  //       <>
  //         <ContestDesktopTable contests={contests} onEdit={handleEdit} onDelete={handleDelete} />
  //
  //         <ContestMobileCard
  //           currentItems={contests}
  //           onEdit={handleEdit.toString}
  //           onDelete={handleDelete.toString}
  //           renderCardAction={(contest, actions) => (
  //             <ContestMobileCard
  //               key={contest.id}
  //               contest={contest}
  //               onClick={() => router.push(`/contests/${contest.id}`)}
  //               onEdit={actions.onEdit.toString}
  //               onDelete={actions.onDelete.toString}
  //             />
  //           )}
  //         />
  //       </>
  //     ) : (
  //       <EmptyState object="contests" onResetAction={() => router.refresh()} />
  //     )}
  //   </>
  // );
}
