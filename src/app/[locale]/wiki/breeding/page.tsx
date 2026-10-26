import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import BreedingContent from "@/components/pages/wiki/breeding/BreedingContent";

export default async function BreedingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breeding" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <BreedingContent
          intro={t("intro")}
          requirementsTitle={t("requirements_title")}
          requirementsBody={t("requirements_body")}
          howToBreedTitle={t("how_to_breed_title")}
          howToBreedBody={t("how_to_breed_body")}
          gestationTitle={t("gestation_title")}
          gestationBody={t("gestation_body")}
          simultaneousTitle={t("simultaneous_title")}
          simultaneousBody={t("simultaneous_body")}
          twinsTitle={t("twins_title")}
          twinsBody={t("twins_body")}
          growingUpTitle={t("growing_up_title")}
          growingUpBody={t("growing_up_body")}
          powerGrowthTitle={t("power_growth_title")}
          powerGrowthBody={t("power_growth_body")}
          reducingTimeTitle={t("reducing_time_title")}
          reducingTimeBody={t("reducing_time_body")}
          reducingRestTitle={t("reducing_rest_title")}
          reducingRestBody={t("reducing_rest_body")}
          bonusesTitle={t("bonuses_title")}
          bonusesBody={t("bonuses_body")}
          bonusTypesTitle={t("bonus_types_title")}
          bonusClub={t("bonus_club")}
          bonusAcademy={t("bonus_academy")}
          bonusFertility={t("bonus_fertility")}
          bonusFailed={t("bonus_failed")}
          bonusRegion={t("bonus_region")}
          specialCoatsTitle={t("special_coats_title")}
          specialCoatsBody={t("special_coats_body")}
          animalLevelsTitle={t("animal_levels_title")}
          animalLevelsBody={t("animal_levels_body")}
          animalXpTitle={t("animal_xp_title")}
          animalXpBody={t("animal_xp_body")}
          regionBonusTitle={t("region_bonus_title")}
          regionBonusBody={t("region_bonus_body")}
          colRegion={t("col_region")}
          colBiome={t("col_biome")}
          gestationTableTitle={t("gestation_table_title")}
          colSpecies={t("col_species")}
          colGestation={t("col_gestation")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
