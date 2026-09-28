import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ContestDetailClient from "./ContestDetailClient";
import { getContestById, getResultsByContestId } from "@/service/ContestService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ContestDetailPage({ params }: PageProps) {
  const { id, locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Member") && !isMayor(session)) {
    redirect(`/${locale}/contests`);
  }

  const [contest, results] = await Promise.all([getContestById(id), getResultsByContestId(id)]);

  if (!contest) {
    notFound();
  }

  return <ContestDetailClient contest={contest!} results={results} />;
}
