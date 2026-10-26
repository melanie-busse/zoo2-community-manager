import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import NormalChestsContent from "@/components/pages/wiki/normal-chests/NormalChestsContent";

export default async function NormalChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "normalchests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <NormalChestsContent
          intro={t("intro")}
          obtainingTitle={t("obtaining_title")}
          obtainingBody={t("obtaining_body")}
          costTitle={t("cost_title")}
          costBody={t("cost_body")}
          costColLevel={t("cost_col_level")}
          costColCost={t("cost_col_cost")}
          contentsTitle={t("contents_title")}
          contentsBody={t("contents_body")}
          specialItemsTitle={t("special_items_title")}
          specialItemsBody={t("special_items_body")}
          animalsTitle={t("animals_title")}
          animalsBody={t("animals_body")}
          tipsTitle={t("tips_title")}
          tipsBody={t("tips_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
