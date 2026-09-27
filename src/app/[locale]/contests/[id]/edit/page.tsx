import React from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getAllStatues, getContestById, getContestSpecialCoats } from "@/service/ContestService";
import ContestEditClient from "./ContestEditClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface EditContestPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditContestPage({ params }: EditContestPageProps) {
  const { id, locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Employee") && !isMayor(session)) {
    redirect(`/${locale}/contests`);
  }

  const [contest, statues, allSpecialCoats] = await Promise.all([
    getContestById(id),
    getAllStatues(),
    getContestSpecialCoats(locale),
  ]);

  if (!contest) {
    notFound();
  }

  return (
    <ContestEditClient
      contest={JSON.parse(JSON.stringify(contest))}
      statues={JSON.parse(JSON.stringify(statues))}
      contestSpecialCoats={JSON.parse(JSON.stringify(allSpecialCoats))}
    />
  );
}
