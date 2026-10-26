import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import VideoChestsContent from "@/components/pages/wiki/video-chests/VideoChestsContent";

export default async function VideoChestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videochests" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <VideoChestsContent
          intro={t("intro")}
          contentTitle={t("content_title")}
          contentBody={t("content_body")}
          availabilityTitle={t("availability_title")}
          availabilityBody={t("availability_body")}
          limitTitle={t("limit_title")}
          limitBody={t("limit_body")}
          platformTitle={t("platform_title")}
          platformBody={t("platform_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
