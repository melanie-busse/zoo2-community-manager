import AnimalOverviewClient from "./AnimalOverviewClient";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import { getAllAnimals } from "@/service/AnimalService";

export default async function AnimalOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const initialAnimals = await getAllAnimals(locale);

  return (
    <PageWrapper>
      <AnimalOverviewClient initialAnimals={initialAnimals} />
    </PageWrapper>
  );
}
