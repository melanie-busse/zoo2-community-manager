import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import RescueCenterContent from "@/components/pages/wiki/rescue-center/RescueCenterContent";

export default async function RescueCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rescuecenter" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <RescueCenterContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          unlockingTitle={t("unlocking_title")}
          unlockingBody={t("unlocking_body")}
          animalShopTitle={t("animal_shop_title")}
          animalShopBody={t("animal_shop_body")}
          landTitle={t("land_title")}
          landBody={t("land_body")}
          animalCareTitle={t("animal_care_title")}
          animalCareBody={t("animal_care_body")}
          careTypesTitle={t("care_types_title")}
          careTypeMedication={t("care_type_medication")}
          careTypeWound={t("care_type_wound")}
          careTypePetting={t("care_type_petting")}
          careTypePlaying={t("care_type_playing")}
          careTypeFeeding={t("care_type_feeding")}
          careTypeCleaning={t("care_type_cleaning")}
          workersTitle={t("workers_title")}
          workersBody={t("workers_body")}
          healingTitle={t("healing_title")}
          healingBody={t("healing_body")}
          transferTitle={t("transfer_title")}
          transferBody={t("transfer_body")}
          exclusivesTitle={t("exclusives_title")}
          exclusivesBody={t("exclusives_body")}
          colAnimal={t("col_animal")}
          colNotes={t("col_notes")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
