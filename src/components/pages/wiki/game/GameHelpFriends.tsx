import { useTranslations } from "next-intl";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import React from "react";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";

export default function GameHelpFriends() {
  const t = useTranslations("wiki_game.friends");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/friends.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("recruited_title")} paragraph={t("recruited_body")} />
        <WikiSubSectionTitle>{t("objectives_title")}</WikiSubSectionTitle>
        <WikiBulletList>
          <li>{t("objective_level")}</li>
          <li>{t("objective_animals")}</li>
          <li>{t("objective_diamonds")}</li>
          <li>{t("objective_academy")}</li>
          <li>{t("objective_recruit")}</li>
        </WikiBulletList>
        <p>{t("objectives_note")}</p>

        <WikiSubSectionTitle>{t("rewards_title")}</WikiSubSectionTitle>
        <p>{t("ingame_body")}</p>

        <WikiTitelParagraph title={t("adding_title")} paragraph={t("adding_body")} />
        <WikiTitelParagraph title={t("removing_title")} paragraph={t("removing_body")} />
        <WikiTitelParagraph title={t("zoo_details_title")} paragraph={t("zoo_details_body")} />
        <WikiTitelParagraph title={t("messaging_title")} paragraph={t("messaging_body")} />
        <WikiTitelParagraph title={t("levelup_title")} paragraph={t("levelup_body")} />
        <WikiTitelParagraph title={t("chests_title")} paragraph={t("chests_body")} />
        <WikiTitelParagraph title={t("helping_title")} paragraph={t("helping_body")} />
        <WikiSubSectionTitle>{t("minigames_title")}</WikiSubSectionTitle>
        <WikiBulletList>
          <li>{t("minigame_crows")}</li>
          <li>{t("minigame_children")}</li>
          <li>{t("minigame_animals")}</li>
        </WikiBulletList>

        <WikiSubSectionTitle>{t("skip_title")}</WikiSubSectionTitle>
        <p>{t("skip_body")}</p>

        <WikiTitelParagraph
          title={t("troubleshooting_title")}
          paragraph={t("troubleshooting_body")}
        />
        <WikiBulletList>
          <li>{t("fix_device")}</li>
          <li>{t("fix_friends")}</li>
          <li>{t("fix_settings")}</li>
        </WikiBulletList>
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}
