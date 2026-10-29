"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { WikiBulletList } from "@/components/pages/wiki/_elements/WikiBulletList";
import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

const MEMBERSHIP_COSTS: {
  tier: string;
  duration: string;
  startup: string;
  extend: string;
  stamps: string;
  costPerStamp: string;
}[] = [
  {
    tier: "Bronze",
    duration: "1 day",
    startup: "0 💎",
    extend: "8 💎",
    stamps: "—",
    costPerStamp: "—",
  },
  {
    tier: "Bronze",
    duration: "7 days",
    startup: "0 💎",
    extend: "32 💎",
    stamps: "—",
    costPerStamp: "—",
  },
  {
    tier: "Bronze",
    duration: "30 days",
    startup: "79 💎",
    extend: "55 💎",
    stamps: "1",
    costPerStamp: "55 💎",
  },
  {
    tier: "Silver",
    duration: "1 day",
    startup: "0 💎",
    extend: "22 💎",
    stamps: "—",
    costPerStamp: "—",
  },
  {
    tier: "Silver",
    duration: "7 days",
    startup: "0 💎",
    extend: "90 💎",
    stamps: "1",
    costPerStamp: "90 💎",
  },
  {
    tier: "Silver",
    duration: "30 days",
    startup: "224 💎",
    extend: "171 💎",
    stamps: "3",
    costPerStamp: "57 💎",
  },
  {
    tier: "Gold",
    duration: "1 day",
    startup: "0 💎",
    extend: "33 💎",
    stamps: "—",
    costPerStamp: "—",
  },
  {
    tier: "Gold",
    duration: "7 days",
    startup: "0 💎",
    extend: "147 💎",
    stamps: "3",
    costPerStamp: "49 💎",
  },
  {
    tier: "Gold",
    duration: "30 days",
    startup: "336 💎",
    extend: "287 💎",
    stamps: "5",
    costPerStamp: "57 💎",
  },
  {
    tier: "Platinum",
    duration: "1 day",
    startup: "0 💎",
    extend: "49 💎",
    stamps: "1",
    costPerStamp: "49 💎",
  },
  {
    tier: "Platinum",
    duration: "7 days",
    startup: "0 💎",
    extend: "209 💎",
    stamps: "4",
    costPerStamp: "52 💎",
  },
  {
    tier: "Platinum",
    duration: "30 days",
    startup: "499 💎",
    extend: "367 💎",
    stamps: "7",
    costPerStamp: "52 💎",
  },
];

export default function WikiAcademyContent() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <WikiCard title={t("membership_title")}>
        <p>{t("membership_body")}</p>
      </WikiCard>

      <WikiCard title={t("stamps_title")}>
        <p>{t("stamps_body")}</p>
        <WikiTable>
          <thead>
            <tr>
              <th>{t("col_membership")}</th>
              <th>{t("col_duration")}</th>
              <th>{t("col_startup")}</th>
              <th>{t("col_extend")}</th>
              <th>{t("col_stamps")}</th>
              <th>{t("col_cost_per_stamp")}</th>
            </tr>
          </thead>
          <tbody>
            {MEMBERSHIP_COSTS.map((row, i) => (
              <tr key={i}>
                <td>{row.tier}</td>
                <td>{row.duration}</td>
                <td>{row.startup}</td>
                <td>{row.extend}</td>
                <td>{row.stamps}</td>
                <td>{row.costPerStamp}</td>
              </tr>
            ))}
          </tbody>
        </WikiTable>
      </WikiCard>

      <WikiCard title={t("mastery_title")}>
        <p>{t("mastery_body")}</p>
      </WikiCard>

      <WikiCard title={t("tasks_title")}>
        <p>{t("tasks_body")}</p>
      </WikiCard>

      <WikiCard title={t("tips_title")}>
        <p>{t("tips_intro")}</p>
        <WikiBulletList>
          <li>{t("tip_1")}</li>
          <li>{t("tip_2")}</li>
          <li>{t("tip_3")}</li>
          <li>{t("tip_4")}</li>
          <li>{t("tip_5")}</li>
        </WikiBulletList>
      </WikiCard>
    </WikiContainer>
  );
}
