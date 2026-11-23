import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTitelParagraph from "@/components/pages/wiki/_elements/WikiTitelParagraph";
import { WikiBulletList } from "../_elements/WikiBulletList";
import WikiSubSectionTitleParagraph from "@/components/pages/wiki/_elements/WikiSubSectionTitleParagraph";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";
import styled from "styled-components";
import WikiSubSectionTitle from "@/components/pages/wiki/_elements/WikiSubSectionTitle";

const BONUS_OFFERS = [
  {
    type: "XP Boost",
    offer: "10% XP Bonus",
    limit: "3x / day",
    details: "Applies to all XP sources for 30 min",
  },
  {
    type: "Fertility Bonus",
    offer: "Fertility +10%",
    limit: "3x / day",
    details: "Increases breeding success rate",
  },
  {
    type: "Video Chest",
    offer: "1 Video Chest",
    limit: "5x / day",
    details: "Contains random items or animals",
  },
  {
    type: "Coin Bonus",
    offer: "2x Coins",
    limit: "2x / day",
    details: "Doubles coin income for 1 hour",
  },
  {
    type: "Energy Refill",
    offer: "50 Energy",
    limit: "3x / day",
    details: "Instantly refills energy",
  },
];

export default function GameVideo() {
  const t = useTranslations("wiki_game.video");

  return (
    <WikiAccordeon title={t("title")} image={"/images/wiki/video.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("intro")}</WikiIntroText>
        <WikiTitelParagraph title={t("billboard_title")} paragraph={t("billboard_body")} />
        <WikiTitelParagraph title={t("redeeming_title")} paragraph={t("redeeming_body")} />
        <WikiTitelParagraph title={t("availability_title")} paragraph={t("availability_body")} />
        <WikiTitelParagraph title={t("age_title")} paragraph={t("age_body")} />

        <WikiTitelParagraph title={t("tips_title")} paragraph={t("tips_intro")} />
        <WikiBulletList>
          <li>{t("tip_delay")}</li>
          <li>{t("tip_restart")}</li>
          <li>{t("tip_internet")}</li>
          <li>{t("tip_device")}</li>
          <li>{t("tip_tracking")}</li>
        </WikiBulletList>
        <WikiSubSectionTitleParagraph
          title={t("ios_tracking_title")}
          text={t("ios_tracking_body")}
        />
        <WikiSubSectionTitleParagraph title={t("ios_reset_title")} text={t("ios_reset_body")} />
        <WikiSubSectionTitleParagraph
          title={t("android_reset_title")}
          text={t("android_reset_body")}
        />

        <WikiTitelParagraph title={t("bonus_title")} paragraph={t("bonus_body")} />
        <VideoTableWrapper>
          <WikiTable>
            <thead>
              <tr>
                <th>{t("col_type")}</th>
                <th>{t("col_offer")}</th>
                <th>{t("col_limit")}</th>
                <th>{t("col_details")}</th>
              </tr>
            </thead>
            <tbody>
              {BONUS_OFFERS.map((row, i) => (
                <tr key={i}>
                  <td>{row.type}</td>
                  <td>{row.offer}</td>
                  <td>{row.limit}</td>
                  <td>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </WikiTable>
        </VideoTableWrapper>

        <WikiSubSectionTitle>{t("bonus_notes_title")}</WikiSubSectionTitle>
        <WikiSubSectionTitleParagraph title={t("xp_bonus_title")} text={t("xp_bonus_body")} />
        <WikiSubSectionTitleParagraph title={t("xp_sources_title")} text={t("xp_sources_body")} />
        <WikiSubSectionTitleParagraph title={t("fertility_title")} text={t("fertility_body")} />
        <WikiSubSectionTitleParagraph
          title={t("video_chests_title")}
          text={t("video_chests_body")}
        />

        <WikiTitelParagraph title={t("limits_title")} paragraph={t("limits_body")} />
      </WikiAccordionContentWrapper>
    </WikiAccordeon>
  );
}

const VideoTableWrapper = styled.div`
  width: 800px;
`;
