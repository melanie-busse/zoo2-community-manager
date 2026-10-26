import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import TerrainEditorContent from "@/components/pages/wiki/terrain-editor/TerrainEditorContent";

export default async function TerrainEditorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terraineditor" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <TerrainEditorContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          accessTitle={t("access_title")}
          accessBody={t("access_body")}
          connectedTitle={t("connected_title")}
          connectedBody={t("connected_body")}
          colTerrain={t("col_terrain")}
          colMainZoo={t("col_main_zoo")}
          colFirGrove={t("col_fir_grove")}
          colKujaliPark={t("col_kujali_park")}
          colOceanside={t("col_oceanside")}
          colPolarPark={t("col_polar_park")}
          colRainforestPark={t("col_rainforest_park")}
          colRescueCenter={t("col_rescue_center")}
          disconnectedTitle={t("disconnected_title")}
          disconnectedBody={t("disconnected_body")}
          colTerrarium={t("col_terrarium")}
          colAquarium={t("col_aquarium")}
          colNoctarium={t("col_noctarium")}
          visualsTitle={t("visuals_title")}
          visualsBody={t("visuals_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
