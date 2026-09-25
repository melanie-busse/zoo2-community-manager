import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getInventoryStatistics } from "@/service/InventoryStatisticService";
import InventoryStatisticClient from "./InventoryStatisticClient";

export default async function InventoryStatisticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}`);
  }

  const userId = typeof session.user.id === "string"
    ? parseInt(session.user.id, 10)
    : session.user.id;

  const biomeStatistics = await getInventoryStatistics(userId, locale);

  return (
    <PageWrapper>
      <InventoryStatisticClient biomeStatistics={biomeStatistics} />
    </PageWrapper>
  );
}