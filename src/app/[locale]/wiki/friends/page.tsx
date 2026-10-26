import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import FriendsContent from "@/components/pages/wiki/friends/FriendsContent";

export default async function FriendsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "friends" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <FriendsContent
          intro={t("intro")}
          recruitedTitle={t("recruited_title")}
          recruitedBody={t("recruited_body")}
          objectivesTitle={t("objectives_title")}
          objectiveLevel={t("objective_level")}
          objectiveAnimals={t("objective_animals")}
          objectiveDiamonds={t("objective_diamonds")}
          objectiveAcademy={t("objective_academy")}
          objectiveRecruit={t("objective_recruit")}
          objectivesNote={t("objectives_note")}
          rewardsTitle={t("rewards_title")}
          ingameTitle={t("ingame_title")}
          ingameBody={t("ingame_body")}
          addingTitle={t("adding_title")}
          addingBody={t("adding_body")}
          removingTitle={t("removing_title")}
          removingBody={t("removing_body")}
          zooDetailsTitle={t("zoo_details_title")}
          zooDetailsBody={t("zoo_details_body")}
          helpingTitle={t("helping_title")}
          helpingBody={t("helping_body")}
          minigamesTitle={t("minigames_title")}
          minigameCrows={t("minigame_crows")}
          minigameChildren={t("minigame_children")}
          minigameAnimals={t("minigame_animals")}
          skipTitle={t("skip_title")}
          skipBody={t("skip_body")}
          messagingTitle={t("messaging_title")}
          messagingBody={t("messaging_body")}
          deletingTitle={t("deleting_title")}
          deletingBody={t("deleting_body")}
          levelupTitle={t("levelup_title")}
          levelupBody={t("levelup_body")}
          chestsTitle={t("chests_title")}
          chestsBody={t("chests_body")}
          troubleshootingTitle={t("troubleshooting_title")}
          troubleshootingBody={t("troubleshooting_body")}
          fixDevice={t("fix_device")}
          fixFriends={t("fix_friends")}
          fixSettings={t("fix_settings")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
