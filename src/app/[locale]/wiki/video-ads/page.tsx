import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import VideoAdsContent from "@/components/pages/wiki/video-ads/VideoAdsContent";

export default async function VideoAdsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videoads" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <VideoAdsContent
          intro={t("intro")}
          billboardTitle={t("billboard_title")}
          billboardBody={t("billboard_body")}
          redeemingTitle={t("redeeming_title")}
          redeemingBody={t("redeeming_body")}
          availabilityTitle={t("availability_title")}
          availabilityBody={t("availability_body")}
          ageTitle={t("age_title")}
          ageBody={t("age_body")}
          tipsTitle={t("tips_title")}
          tipsIntro={t("tips_intro")}
          tipDelay={t("tip_delay")}
          tipRestart={t("tip_restart")}
          tipInternet={t("tip_internet")}
          tipDevice={t("tip_device")}
          tipTracking={t("tip_tracking")}
          iosTrackingTitle={t("ios_tracking_title")}
          iosTrackingBody={t("ios_tracking_body")}
          iosResetTitle={t("ios_reset_title")}
          iosResetBody={t("ios_reset_body")}
          androidResetTitle={t("android_reset_title")}
          androidResetBody={t("android_reset_body")}
          bonusTitle={t("bonus_title")}
          bonusBody={t("bonus_body")}
          colType={t("col_type")}
          colOffer={t("col_offer")}
          colLimit={t("col_limit")}
          colDetails={t("col_details")}
          bonusNotesTitle={t("bonus_notes_title")}
          xpBonusTitle={t("xp_bonus_title")}
          xpBonusBody={t("xp_bonus_body")}
          xpSourcesTitle={t("xp_sources_title")}
          xpSourcesBody={t("xp_sources_body")}
          fertilityTitle={t("fertility_title")}
          fertilityBody={t("fertility_body")}
          videoChestsTitle={t("video_chests_title")}
          videoChestsBody={t("video_chests_body")}
          limitsTitle={t("limits_title")}
          limitsBody={t("limits_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
