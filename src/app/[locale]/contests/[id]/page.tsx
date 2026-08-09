import { notFound } from "next/navigation";
import ContestDetailClient from "./ContestDetailClient";
import { getContestById, getResultsByContestId } from "@/service/ContestService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContestDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [contest, results] = await Promise.all([getContestById(id), getResultsByContestId(id)]);

  if (!contest) {
    notFound();
  }

  return <ContestDetailClient contest={contest!} results={results} />;
}
