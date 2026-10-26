import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import CurrencyContent from "@/components/pages/wiki/currency/CurrencyContent";

export default async function CurrencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "currency" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <CurrencyContent
          intro={t("intro")}
          coinsTitle={t("coins_title")}
          coinsBody={t("coins_body")}
          generatingCoinsTitle={t("generating_coins_title")}
          generatingCoinsBody={t("generating_coins_body")}
          spendingCoinsTitle={t("spending_coins_title")}
          spendingCoinsBody={t("spending_coins_body")}
          diamondsTitle={t("diamonds_title")}
          diamondsBody={t("diamonds_body")}
          freeDiamondsTitle={t("free_diamonds_title")}
          freeDiamondsGameplayTitle={t("free_diamonds_gameplay_title")}
          freeDiamondsGameplayBody={t("free_diamonds_gameplay_body")}
          watchingAdsTitle={t("watching_ads_title")}
          watchingAdsBody={t("watching_ads_body")}
          newsSubscriptionsTitle={t("news_subscriptions_title")}
          newsSubscriptionsBody={t("news_subscriptions_body")}
          socialMediaTitle={t("social_media_title")}
          socialMediaBody={t("social_media_body")}
          upjersPortalTitle={t("upjers_portal_title")}
          upjersPortalBody={t("upjers_portal_body")}
          buyingDiamondsTitle={t("buying_diamonds_title")}
          buyingDiamondsBody={t("buying_diamonds_body")}
          ticketsTitle={t("tickets_title")}
          ticketsBody={t("tickets_body")}
          keysTitle={t("keys_title")}
          keysBody={t("keys_body")}
          energyTitle={t("energy_title")}
          energyBody={t("energy_body")}
          feathersTitle={t("feathers_title")}
          feathersBody={t("feathers_body")}
          eventCurrencyTitle={t("event_currency_title")}
          eventCurrencyBody={t("event_currency_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
