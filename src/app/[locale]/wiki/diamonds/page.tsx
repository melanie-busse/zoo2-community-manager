import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import DiamondsContent from "@/components/pages/wiki/diamonds/DiamondsContent";

export default async function DiamondsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "diamonds" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <DiamondsContent
          intro={t("intro")}
          earningTitle={t("earning_title")}
          earningBody={t("earning_body")}
          spendingTitle={t("spending_title")}
          spendingBody={t("spending_body")}
          dealsTitle={t("deals_title")}
          dealsBody={t("deals_body")}
          dealSpecialGuestTitle={t("deal_special_guest_title")}
          dealSpecialGuestBody={t("deal_special_guest_body")}
          dealPiggyBankTitle={t("deal_piggy_bank_title")}
          dealPiggyBankBody={t("deal_piggy_bank_body")}
          dealWelcomeTitle={t("deal_welcome_title")}
          dealWelcomeBody={t("deal_welcome_body")}
          dealFunFiestaTitle={t("deal_fun_fiesta_title")}
          dealFunFiestaBody={t("deal_fun_fiesta_body")}
          dealBunnyBiteTitle={t("deal_bunny_bite_title")}
          dealBunnyBiteBody={t("deal_bunny_bite_body")}
          dealVoucherTitle={t("deal_voucher_title")}
          dealVoucherBody={t("deal_voucher_body")}
          dealStarSavingsTitle={t("deal_star_savings_title")}
          dealStarSavingsBody={t("deal_star_savings_body")}
          deal55Title={t("deal_55_title")}
          deal55Body={t("deal_55_body")}
          deal60Title={t("deal_60_title")}
          deal60Body={t("deal_60_body")}
          buyingTitle={t("buying_title")}
          buyingBody={t("buying_body")}
          colDiamonds={t("col_diamonds")}
          colUsd={t("col_usd")}
          colEur={t("col_eur")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
