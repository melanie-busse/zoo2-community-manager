"use client";

import styled from "styled-components";
import { useTranslations } from "next-intl";
import React from "react";

import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import { Image } from "@/types/image";
import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import FriendshipChest from "@/components/pages/wiki/chests/FriendshipChest";
import NormalChest from "@/components/pages/wiki/chests/NormalChest";
import EpicChest from "@/components/pages/wiki/chests/EpicChest";
import RetroChest from "@/components/pages/wiki/chests/RetroChest";
import LegendaryChest from "@/components/pages/wiki/chests/LegendaryChest";
import TerraquaChest from "@/components/pages/wiki/chests/TerraquaChest";
import NoctaviaChest from "@/components/pages/wiki/chests/NoctaviaChest";
import VideoChest from "@/components/pages/wiki/chests/VideoChest";

export default function WikiChestsContent() {
  const t = useTranslations("chestsfaq");

  const chestImage: Image = {
    name: "Chest Icon",
    path: `/images/wiki/legendary_chest.jpg`,
    alt: `chest`,
  };

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} image={chestImage} />

      <FriendshipChest />
      <NormalChest />
      <EpicChest />
      <RetroChest />
      <LegendaryChest />
      <TerraquaChest />
      <NoctaviaChest />
      <VideoChest />

      <WikiCard title={t("keys_title")} image={"/images/wiki/key.webp"}>
        {t("keys_body")}
      </WikiCard>

      <WikiCard title={t("exceptions_title")} image={"/images/wiki/no_chest.jpg"}>
        <p>{t("exceptions_body")}</p>
        <BulletList>
          <li>{t("exception_expansions")}</li>
          <li>{t("exception_upgrades")}</li>
          <li>{t("exception_employees")}</li>
          <li>{t("exception_other")}</li>
        </BulletList>
      </WikiCard>
    </WikiContainer>
  );
}

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
