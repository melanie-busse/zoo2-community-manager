import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import BulldozerContent from "@/components/pages/wiki/bulldozer/BulldozerContent";

export default async function BulldozerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bulldozer" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <BulldozerContent
          intro={t("intro")}
          overviewTitle={t("overview_title")}
          overviewBody={t("overview_body")}
          eventTitle={t("event_title")}
          eventBody={t("event_body")}
          energyTitle={t("energy_title")}
          energyBody={t("energy_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
