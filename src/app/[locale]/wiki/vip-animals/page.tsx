import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import VipAnimalsContent from "@/components/pages/wiki/vip-animals/VipAnimalsContent";

export default async function VipAnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vipanimals" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <VipAnimalsContent
          intro={t("intro")}
          premiumTitle={t("premium_title")}
          premiumBody={t("premium_body")}
          vipTitle={t("vip_title")}
          vipBody={t("vip_body")}
          premiumHistoryTitle={t("premium_history_title")}
          premiumHistoryBody={t("premium_history_body")}
          vipHistoryTitle={t("vip_history_title")}
          vipHistoryBody={t("vip_history_body")}
          colDate={t("col_date")}
          colAnimal={t("col_animal")}
          colNotes={t("col_notes")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
