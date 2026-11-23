"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import GameLevelUp from "@/components/pages/wiki/game/GameLevelUp";
import GameFocusTip from "@/components/pages/wiki/game/GameFocusTip";
import GameHelpFriends from "@/components/pages/wiki/game/GameHelpFriends";
import GameScrap from "@/components/pages/wiki/game/GameScrap";
import GameBulldozer from "@/components/pages/wiki/game/GameBulldozer";
import GameVisitors from "@/components/pages/wiki/game/GameVisitors";
import GameTerrainEditor from "./GameTerrainEditor";
import GameVideo from "./GameVideo";
import GameCalendar from "@/components/pages/wiki/game/GameCalendar";

export default function WikiGameContent() {
  const t = useTranslations("wiki_game");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("summary_body")} />
      <GameLevelUp />
      <GameVisitors />
      <GameCalendar />
      <GameHelpFriends />
      <GameVideo />
      <GameTerrainEditor />
      <GameBulldozer />
      <GameFocusTip />
      <GameScrap />
    </WikiContainer>
  );
}
