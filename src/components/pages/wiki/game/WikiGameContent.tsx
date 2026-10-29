"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";

export default function WikiGameContent() {
  const t = useTranslations("wiki_game");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <WikiCard title={t("summary_title")}>
        <p>{t("summary_body")}</p>
      </WikiCard>

      <WikiCard title={t("free_stuff_title")}>
        <p>{t("free_stuff_body")}</p>
      </WikiCard>

      <WikiCard title={t("levelup_title")}>
        <p>{t("levelup_body")}</p>
      </WikiCard>

      <WikiCard title={t("focus_title")}>
        <p>{t("focus_intro")}</p>
        <WikiBulletList>
          <li>{t("focus_tip_1")}</li>
          <li>{t("focus_tip_2")}</li>
          <li>{t("focus_tip_3")}</li>
          <li>{t("focus_tip_4")}</li>
          <li>{t("focus_tip_5")}</li>
        </WikiBulletList>
      </WikiCard>

      <WikiCard title={t("coins_title")}>
        <p>{t("coins_body")}</p>
      </WikiCard>

      <WikiCard title={t("diamonds_title")}>
        <p>{t("diamonds_body")}</p>
      </WikiCard>

      <WikiCard title={t("spending_title")}>
        <p>{t("spending_intro")}</p>
        <p>{t("spending_no_sale_diamonds")}</p>
        <p>{t("spending_no_sale_coins")}</p>
        <p>{t("spending_avoid")}</p>
      </WikiCard>

      <WikiCard title={t("sales_title")}>
        <p>{t("sales_body")}</p>
      </WikiCard>

      <WikiCard title={t("land_title")}>
        <p>{t("land_body")}</p>
      </WikiCard>

      <WikiCard title={t("seasonal_title")}>
        <p>{t("seasonal_body")}</p>
      </WikiCard>

      <WikiCard title={t("season_pass_title")}>
        <p>{t("season_pass_body")}</p>
      </WikiCard>

      <WikiCard title={t("conservation_title")}>
        <p>{t("conservation_body")}</p>
      </WikiCard>

      <WikiCard title={t("calendar_title")}>
        <p>{t("calendar_body")}</p>
      </WikiCard>

      <WikiCard title={t("friends_title")}>
        <p>{t("friends_body")}</p>
      </WikiCard>

      <WikiCard title={t("animals_title")}>
        <p>{t("animals_body")}</p>
      </WikiCard>

      <WikiCard title={t("free_mate_title")}>
        <p>{t("free_mate_body")}</p>
      </WikiCard>

      <WikiCard title={t("breeding_title")}>
        <p>{t("breeding_body")}</p>
      </WikiCard>

      <WikiCard title={t("oceanside_title")}>
        <p>{t("oceanside_body")}</p>
      </WikiCard>

      <WikiCard title={t("petting_title")}>
        <p>{t("petting_body")}</p>
      </WikiCard>

      <WikiCard title={t("enclosure_resize_title")}>
        <p>{t("enclosure_resize_body")}</p>
      </WikiCard>

      <WikiCard title={t("clubs_title")}>
        <p>{t("clubs_body")}</p>
      </WikiCard>

      <WikiCard title={t("puzzles_title")}>
        <p>{t("puzzles_body")}</p>
      </WikiCard>

      <WikiCard title={t("scrap_title")}>
        <p>{t("scrap_body")}</p>
      </WikiCard>

      <WikiCard title={t("no_scrap_title")}>
        <p>{t("no_scrap_intro")}</p>
        <WikiBulletList>
          {(t.raw("no_scrap_decos") as string[]).map((deco, index) => (
            <li key={`deco-${index}`}>{deco}</li>
          ))}
        </WikiBulletList>

        <p style={{ marginTop: "16px" }}>{t("no_scrap_animals_intro")}</p>
        <WikiBulletList>
          {(t.raw("no_scrap_animals") as string[]).map((animal, index) => (
            <li key={`animal-${index}`}>{animal}</li>
          ))}
        </WikiBulletList>

        <p style={{ marginTop: "16px" }}>{t("no_scrap_wheel_intro")}</p>
        <WikiBulletList>
          {(t.raw("no_scrap_wheel") as string[]).map((wheelAnimal, index) => (
            <li key={`wheel-${index}`}>{wheelAnimal}</li>
          ))}
        </WikiBulletList>
      </WikiCard>

      <WikiCard title={t("tickets_title")}>
        <p>{t("tickets_body")}</p>
      </WikiCard>

      <WikiCard title={t("academy_tips_title")}>
        <p>{t("academy_tips_body")}</p>
      </WikiCard>

      <WikiCard title={t("hide_quests_title")}>
        <p>{t("hide_quests_body")}</p>
      </WikiCard>

      <WikiCard title={t("rocks_title")}>
        <p>{t("rocks_body")}</p>
      </WikiCard>

      <WikiCard title={t("steam_title")}>
        <p>{t("steam_body")}</p>
      </WikiCard>
    </WikiContainer>
  );
}
