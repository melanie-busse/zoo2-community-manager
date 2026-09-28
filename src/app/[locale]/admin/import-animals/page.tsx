import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import WikiDashboard from "@/components/pages/admin/WikiDashboard/WikiDashboard";
import PageWrapper from "@/components/page-structure/page/PageWrapper";

interface AdminImportPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminImportPage({ params }: AdminImportPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director") && !isMayor(session)) {
    redirect(`/${locale}`);
  }

  return (
    <PageWrapper>
      <WikiDashboard />
    </PageWrapper>
  );
}