import React from "react";
import { notFound } from "next/navigation";

import { getAllStatues, getContestById, getContestSpecialCoats } from "@/service/ContestService";
import ContestEditClient from "./ContestEditClient";

interface EditContestPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditContestPage({ params }: EditContestPageProps) {
  const { id, locale } = await params;

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
