import SpecialCoatsOverviewClient from "./SpecialCoatsOverviewClient";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllSpecialCoats } from "@/service/SpecialCoatsService";

export default async function SpecialCoatsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const initialSpecialCoats = await getAllSpecialCoats(locale);
  return (
    <PageWrapper>
      <SpecialCoatsOverviewClient initialSpecialCoats={initialSpecialCoats} />
    </PageWrapper>
  );
}
