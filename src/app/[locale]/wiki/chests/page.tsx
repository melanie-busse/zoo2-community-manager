import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ChestsFaqContent from "@/components/pages/wiki/chests/ChestsFaqContent";

export default async function ChestsFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chestsfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <ChestsFaqContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          chestTypesTitle={t("chest_types_title")}
          chestFriendship={t("chest_friendship")}
          chestNormal={t("chest_normal")}
          chestEpic={t("chest_epic")}
          chestRetro={t("chest_retro")}
          chestLegendary={t("chest_legendary")}
          chestVideo={t("chest_video")}
          forecastsTitle={t("forecasts_title")}
          forecastsBody={t("forecasts_body")}
          limitsTitle={t("limits_title")}
          limitsBody={t("limits_body")}
          keysTitle={t("keys_title")}
          keysBody={t("keys_body")}
          exceptionsTitle={t("exceptions_title")}
          exceptionsBody={t("exceptions_body")}
          exceptionExpansions={t("exception_expansions")}
          exceptionUpgrades={t("exception_upgrades")}
          exceptionEmployees={t("exception_employees")}
          exceptionOther={t("exception_other")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
