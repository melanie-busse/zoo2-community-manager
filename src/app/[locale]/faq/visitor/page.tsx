import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import VisitorFaqContent from "@/components/pages/zoo/visitorfaq/VisitorFaqContent";

export default async function VisitorFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visitorfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <VisitorFaqContent
          intro={t("intro")}
          modifiersTitle={t("modifiers_title")}
          modifiersIntro={t("modifiers_intro")}
          animalsTitle={t("animals_title")}
          animalsBody={t("animals_body")}
          decorationsTitle={t("decorations_title")}
          decorationsIntro={t("decorations_intro")}
          plantsTitle={t("plants_title")}
          plantsBody={t("plants_body")}
          enclosureDecoTitle={t("enclosure_deco_title")}
          enclosureDecoBody={t("enclosure_deco_body")}
          objectDecoTitle={t("object_deco_title")}
          objectDecoBody={t("object_deco_body")}
          buildingsTitle={t("buildings_title")}
          bathroomsTitle={t("bathrooms_title")}
          bathroomsBody={t("bathrooms_body")}
          trashTitle={t("trash_title")}
          trashBody={t("trash_body")}
          npcsTitle={t("npcs_title")}
          npcsBody={t("npcs_body")}
          calculatorTitle={t("calculator_title")}
          calculatorIntro={t("calculator_intro")}
          calculatorStep1={t("calculator_step_1")}
          calculatorStep2={t("calculator_step_2")}
          calculatorStep3={t("calculator_step_3")}
          calculatorStep4={t("calculator_step_4")}
          calculatorStep5={t("calculator_step_5")}
          calculatorStep6={t("calculator_step_6")}
          calculatorStep7={t("calculator_step_7")}
          calculatorLink={t("calculator_link")}
          tableTitle={t("table_title")}
          tableNote={t("table_note")}
          colLevel={t("col_level")}
          colPointsToNext={t("col_points_to_next")}
          colCumulative={t("col_cumulative")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
