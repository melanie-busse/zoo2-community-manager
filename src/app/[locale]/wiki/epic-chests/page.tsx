import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import EpicChestsContent from "@/components/pages/wiki/epic-chests/EpicChestsContent";

export default async function EpicChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "epicchests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <EpicChestsContent
          intro={t("intro")}
          obtainingTitle={t("obtaining_title")}
          obtainingBody={t("obtaining_body")}
          contentsTitle={t("contents_title")}
          contentsBody={t("contents_body")}
          dropBonusTitle={t("drop_bonus_title")}
          dropBonusBody={t("drop_bonus_body")}
          animalsTitle={t("animals_title")}
          animalsBody={t("animals_body")}
          animalsColAnimal={t("animals_col_animal")}
          animalsColRarity={t("animals_col_rarity")}
          animalsColBiome={t("animals_col_biome")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
