import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getContestById, getMembers } from "@/service/ContestService";
import ContestEntriesClient from "./ContestEntriesClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ContestEntriesPage({ params }: PageProps) {
  const { id, locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Member") && !isMayor(session)) {
    redirect(`/${locale}/contests`);
  }

  const [contest, members] = await Promise.all([getContestById(id), getMembers()]);

  if (!contest) {
    notFound();
  }

  return <ContestEntriesClient contest={contest!} members={members} session={session} />;
}