import React from "react";
import { useTranslations } from "next-intl";

import WikiAccordeon from "@/components/pages/wiki/_elements/WikiAccordeon";
import WikiIntroText from "@/components/pages/wiki/_elements/WikiIntroText";
import WikiAccordionContentWrapper from "@/components/pages/wiki/_elements/WikiAccordionContentWrapper";
import WikiTableWrapper from "@/components/pages/wiki/_elements/WikiTableWrapper";
import { WikiTable } from "@/components/pages/wiki/_elements/WikiTable";

const MEMBERSHIP_COSTS = [
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

export default function AcademyStamps() {
  const t = useTranslations("wiki_academy");

  return (
    <WikiAccordeon title={t("stamps_title")} image={"/images/wiki/academy_stamp.png"}>
      <WikiAccordionContentWrapper>
        <WikiIntroText>{t("stamps_body")}</WikiIntroText>
      </WikiAccordionContentWrapper>

      <WikiTableWrapper>
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
      </WikiTableWrapper>
    </WikiAccordeon>
  );
}
