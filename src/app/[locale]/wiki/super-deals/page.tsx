import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import SuperDealsContent from "@/components/pages/wiki/super-deals/SuperDealsContent";

export default async function SuperDealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "superdeals" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <SuperDealsContent
          intro={t("intro")}
          howItWorksTitle={t("how_it_works_title")}
          howItWorksBody={t("how_it_works_body")}
          typesTitle={t("types_title")}
          typesBody={t("types_body")}
          discontinuedTitle={t("discontinued_title")}
          discontinuedBody={t("discontinued_body")}
          pricingTitle={t("pricing_title")}
          pricingBody={t("pricing_body")}
          colAnimal={t("col_animal")}
          colCardPrice={t("col_card_price")}
          colRescue={t("col_rescue")}
          colShop33={t("col_shop_33")}
          colIceCream={t("col_ice_cream")}
          colSuperDeal={t("col_super_deal")}
          colShopPair={t("col_shop_pair")}
          colChest={t("col_chest")}
          colPrizeWheel={t("col_prize_wheel")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
