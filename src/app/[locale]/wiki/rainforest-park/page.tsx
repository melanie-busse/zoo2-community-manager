import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import RainforestParkContent from "@/components/pages/wiki/rainforest-park/RainforestParkContent";

export default async function RainforestParkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rainforestpark" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <RainforestParkContent
          intro={t("intro")}
          unlockingTitle={t("unlocking_title")}
          unlockingBody={t("unlocking_body")}
          storylineTitle={t("storyline_title")}
          storylineBody={t("storyline_body")}
          bonusesTitle={t("bonuses_title")}
          bonusesBody={t("bonuses_body")}
          enclosureTitle={t("enclosure_title")}
          enclosureBody={t("enclosure_body")}
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
