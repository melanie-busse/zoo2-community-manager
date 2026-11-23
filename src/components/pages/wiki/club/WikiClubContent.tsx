"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import ClubRoles from "@/components/pages/wiki/club/ClubRoles";
import ClubMembershipAdministration from "@/components/pages/wiki/club/ClubMembershipAdministration";
import ClubRank from "@/components/pages/wiki/club/ClubRank";
import ClubLevel from "@/components/pages/wiki/club/ClubLevel";
import ClubFundraiser from "@/components/pages/wiki/club/ClubFundraiser";
import ClubMembership from "@/components/pages/wiki/club/ClubMembership";

export default function WikiClubContent() {
  const t = useTranslations("wiki_club");

  return (
    <>
      <WikiContainer>
        <WikiHeader title={t("title")} introParagraph={t("intro")} />
      </WikiContainer>

      <WikiCard title={t("shop_title")}>
        <p>{t("shop_body")}</p>
      </WikiCard>

      <ClubRoles />
      <ClubMembershipAdministration />
      <ClubRank />
      <ClubLevel />
      <ClubFundraiser />
      <ClubMembership />
    </>
  );
}
