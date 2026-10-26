import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import KujaliParkContent from "@/components/pages/wiki/kujali-park/KujaliParkContent";

export default async function KujaliParkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kujalipark" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <KujaliParkContent
          intro={t("intro")}
          unlockingTitle={t("unlocking_title")}
          unlockingBody={t("unlocking_body")}
          bonusesTitle={t("bonuses_title")}
          bonusesBody={t("bonuses_body")}
          rocksTitle={t("rocks_title")}
          rocksBody={t("rocks_body")}
          rocksColType={t("rocks_col_type")}
          rocksColLayers={t("rocks_col_layers")}
          rocksColCost={t("rocks_col_cost")}
          rocksColTime={t("rocks_col_time")}
          buildingsTitle={t("buildings_title")}
          buildingsBody={t("buildings_body")}
          buildingsColBuilding={t("buildings_col_building")}
          buildingsColCost={t("buildings_col_cost")}
          boothTitle={t("booth_title")}
          boothBody={t("booth_body")}
          boothColLevel={t("booth_col_level")}
          boothColCapacity={t("booth_col_capacity")}
          breedingTitle={t("breeding_title")}
          breedingBody={t("breeding_body")}
          breedingColSlot={t("breeding_col_slot")}
          breedingColCost={t("breeding_col_cost")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
