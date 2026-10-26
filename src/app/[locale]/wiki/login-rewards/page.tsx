import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import LoginRewardsContent from "@/components/pages/wiki/login-rewards/LoginRewardsContent";

export default async function LoginRewardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "loginrewards" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <LoginRewardsContent
          intro={t("intro")}
          howItWorksTitle={t("how_it_works_title")}
          howItWorksBody={t("how_it_works_body")}
          monthlyRewardsTitle={t("monthly_rewards_title")}
          monthlyRewardsBody={t("monthly_rewards_body")}
          colMonth={t("col_month")}
          colAnimal1={t("col_animal1")}
          colAnimal2={t("col_animal2")}
          colChests={t("col_chests")}
          adventTitle={t("advent_title")}
          adventBody={t("advent_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
