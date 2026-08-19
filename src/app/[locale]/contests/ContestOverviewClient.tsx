"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { Contest } from "@/types/contest";
import { useContestStore } from "@/store/useContestStore";
import ContestOverviewContent from "@/components/pages/contests/ContestOverview/ContestOverviewContent";

interface ContestOverviewClientProps {
  initialContests: Contest[];
}

export default function ContestOverviewClient({ initialContests }: ContestOverviewClientProps) {
  const router = useRouter();
  const tContest = useTranslations("contest");
  const tCommon = useTranslations("common");

  const { allContests, setInitialContests, deleteContest } = useContestStore();

  useEffect(() => {
    setInitialContests(initialContests);
  }, [initialContests, setInitialContests]);

  const handleEdit = (id: string) => router.push(`/contests/${id}/edit`);

  const handleDelete = async (id: string) => {
    await deleteContest(Number(id), tContest, tCommon);
  };

  return (
    <ContestOverviewContent
      contests={allContests}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}
