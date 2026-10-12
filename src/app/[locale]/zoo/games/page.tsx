import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllBiomeGames } from "@/service/BiomeService";
import { getTranslations } from "next-intl/server";
import BiomeGameOverviewContent from "@/components/pages/zoo/games/BiomeGameOverviewContent";

export default async function BiomeGameOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [games, t] = await Promise.all([
    getAllBiomeGames(locale),
    getTranslations({ locale, namespace: "game" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <BiomeGameOverviewContent games={games} />
      </ContentWrapper>
    </PageWrapper>
  );
}
