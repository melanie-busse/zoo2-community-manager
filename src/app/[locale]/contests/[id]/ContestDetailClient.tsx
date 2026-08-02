"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContestDonation } from "@/types/contest";
import { useContestStore } from "@/store/useContestStore";

import type { getContestById } from "@/service/ContestService";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { calculateAnimalStats } from "@/utils/ContestUtil";
import ContestDetailView from "@/components/pages/Contests/ContestDetails/ContestDetailView";

type ContestDetail = NonNullable<Awaited<ReturnType<typeof getContestById>>>;

interface ContestDetailClientProps {
  contest: ContestDetail;
  results: ContestDonation[];
}

export default function ContestDetailClient({ contest, results }: ContestDetailClientProps) {
  const router = useRouter();
  const t = useTranslations("contest");
  const tCommon = useTranslations("common");
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
    animal: link.statue.animal,
    stats: calculateAnimalStats(link.statue.animal.id, results),
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
      />
    </PageWrapper>
  );
}
