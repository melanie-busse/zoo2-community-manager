import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import NoctaviaChestsContent from "@/components/pages/wiki/noctavia-chests/NoctaviaChestsContent";

export default async function NoctaviaChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "noctaviachests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <NoctaviaChestsContent
          intro={t("intro")}
          contentTitle={t("content_title")}
          contentNote={t("content_note")}
          noctariumTitle={t("noctarium_title")}
          noctariumEnclosuresTitle={t("noctarium_enclosures_title")}
          noctariumBuildingsTitle={t("noctarium_buildings_title")}
          noctariumFlowersTitle={t("noctarium_flowers_title")}
          noctariumBoundariesTitle={t("noctarium_boundaries_title")}
          noctariumSpecialTitle={t("noctarium_special_title")}
          aviaryTitle={t("aviary_title")}
          aviaryEnclosuresTitle={t("aviary_enclosures_title")}
          aviaryBuildingsTitle={t("aviary_buildings_title")}
          aviaryFlowersTitle={t("aviary_flowers_title")}
          aviaryBoundariesTitle={t("aviary_boundaries_title")}
          aviarySpecialTitle={t("aviary_special_title")}
          colItem={t("col_item")}
          colRarity={t("col_rarity")}
          rarityCommon={t("rarity_common")}
          rarityRare={t("rarity_rare")}
          rarityEpic={t("rarity_epic")}
          rarityLegendary={t("rarity_legendary")}
          rarityUnconfirmed={t("rarity_unconfirmed")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
