import { notFound } from "next/navigation";

import { getContestById, getMembers } from "@/service/ContestService";
import ContestEntriesClient from "./ContestEntriesClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContestEntriesPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, members] = await Promise.all([getContestById(id), getMembers()]);

  if (!contest) {
    notFound();
  }

  return <ContestEntriesClient contest={contest!} members={members} />;
}