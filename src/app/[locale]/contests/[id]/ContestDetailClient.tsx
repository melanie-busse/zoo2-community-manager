"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { ContestDonation } from "@/types/contest";
import { useContestStore } from "@/store/useContestStore";

import type { getContestById } from "@/service/ContestService";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { calculateAnimalStats } from "@/utils/ContestUtil";
import ContestDetailView from "@/components/pages/contests/ContestDetails/ContestDetailView";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

type ContestDetail = NonNullable<Awaited<ReturnType<typeof getContestById>>>;

interface ContestDetailClientProps {
  contest: ContestDetail;
  results: ContestDonation[];
}

export default function ContestDetailClient({ contest, results }: ContestDetailClientProps) {
  const router = useRouter();
  const t = useTranslations("contest");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const canEdit = hasMinimumRole(session, "Employee") || isMayor(session);
  const deleteContest = useContestStore((state) => state.deleteContest);

  const handleEdit = () => {
    router.push(`/contests/${contest.id}/edit`);
  };

  const handleDelete = async () => {
    const success = await deleteContest(contest.id, t, tCommon);
    if (success) {
      router.push("/contests");
    }
  };

  const animals = contest.conteststatue?.map((link) => ({
    animal: link.animal,
    stats: calculateAnimalStats(link.animal.id, results),
  }));

  const specialCoats = contest.contestspecialcoat?.map((link) => ({
    animal: link.specialcoat.animal,
    stats: calculateAnimalStats(link.specialcoat.animal.id, results),
  }));

  return (
    <PageWrapper>
      <ContestDetailView
        contest={contest}
        animals={animals}
        specialCoat={specialCoats}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={canEdit}
      />
    </PageWrapper>
  );
}
