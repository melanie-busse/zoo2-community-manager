import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import IceCreamVendorContent from "@/components/pages/wiki/ice-cream-vendor/IceCreamVendorContent";

export default async function IceCreamVendorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "icecreamvendor" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <IceCreamVendorContent
          intro={t("intro")}
          howItWorksTitle={t("how_it_works_title")}
          howItWorksBody={t("how_it_works_body")}
          dealsTitle={t("deals_title")}
          dealsBody={t("deals_body")}
          obtainingTitle={t("obtaining_title")}
          obtainingBody={t("obtaining_body")}
          colAnimal={t("col_animal")}
          colShopTab={t("col_shop_tab")}
          colChest={t("col_chest")}
          colOther={t("col_other")}
          npcTitle={t("npc_title")}
          npcBody={t("npc_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
