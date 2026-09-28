import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import ContestCreateClient from "./ContestCreateClient";
import { getAllStatues, getContestSpecialCoats } from "@/service/ContestService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface CreateContestPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreateContestPage({ params }: CreateContestPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Employee") && !isMayor(session)) {
    redirect(`/${locale}/contests`);
  }

  const [allStatues, allSpecialCoats] = await Promise.all([
    getAllStatues(),
    getContestSpecialCoats(),
  ]);

  return (
    <ContestCreateClient
      statues={JSON.parse(JSON.stringify(allStatues))}
      contestSpecialCoats={JSON.parse(JSON.stringify(allSpecialCoats))}
    />
  );
}
