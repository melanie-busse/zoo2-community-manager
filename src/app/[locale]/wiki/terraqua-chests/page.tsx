import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import TerraquaChestsContent from "@/components/pages/wiki/terraqua-chests/TerraquaChestsContent";

export default async function TerraquaChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terraquachests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <TerraquaChestsContent
          intro={t("intro")}
          contentTitle={t("content_title")}
          contentNote={t("content_note")}
          terrariumTitle={t("terrarium_title")}
          terrariumLeafyTitle={t("terrarium_leafy_title")}
          terrariumRockyTitle={t("terrarium_rocky_title")}
          terrariumBuildingsTitle={t("terrarium_buildings_title")}
          terrariumFlowersTitle={t("terrarium_flowers_title")}
          terrariumTreesTitle={t("terrarium_trees_title")}
          terrariumBoundariesTitle={t("terrarium_boundaries_title")}
          terrariumSpecialTitle={t("terrarium_special_title")}
          aquariumTitle={t("aquarium_title")}
          aquariumFreshwaterTitle={t("aquarium_freshwater_title")}
          aquariumSaltwaterTitle={t("aquarium_saltwater_title")}
          aquariumBuildingsTitle={t("aquarium_buildings_title")}
          aquariumFlowersTitle={t("aquarium_flowers_title")}
          aquariumTreesTitle={t("aquarium_trees_title")}
          aquariumBoundariesTitle={t("aquarium_boundaries_title")}
          aquariumSpecialTitle={t("aquarium_special_title")}
          colItem={t("col_item")}
          colRarity={t("col_rarity")}
          rarityCommon={t("rarity_common")}
          rarityRare={t("rarity_rare")}
          rarityEpic={t("rarity_epic")}
          rarityLegendary={t("rarity_legendary")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
