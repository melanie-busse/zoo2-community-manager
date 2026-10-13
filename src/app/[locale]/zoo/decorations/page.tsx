import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import { getAllBiomeDecorations, getAllBiomes } from "@/service/BiomeService";
import { getTranslations } from "next-intl/server";
import BiomeDecorationOverviewContent from "@/components/pages/zoo/decorations/BiomeDecorationOverviewContent";

export default async function BiomeDecorationOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [decorations, biomes, t] = await Promise.all([
    getAllBiomeDecorations(locale),
    getAllBiomes(locale),
    getTranslations({ locale, namespace: "decoration" }),
  ]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("overview_title")} />
        <BiomeDecorationOverviewContent
          decorations={JSON.parse(JSON.stringify(decorations))}
          biomes={JSON.parse(JSON.stringify(biomes))}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
