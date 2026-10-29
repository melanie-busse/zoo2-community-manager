"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import WikiCard from "@/components/pages/wiki/_elements/WikiCard";
import WikiSubSectionTitle from "../_elements/WikiSubSectionTitle";

export default function WikiCurrencyContent() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <WikiCard title={t("coins_title")}>
        <p>{t("coins_body")}</p>
        <WikiSubSectionTitle>{t("generating_coins_title")}</WikiSubSectionTitle>
        <p>{t("generating_coins_body")}</p>
        <WikiSubSectionTitle>{t("spending_coins_title")}</WikiSubSectionTitle>
        <p>{t("spending_coins_body")}</p>
      </WikiCard>

      <WikiCard title={t("diamonds_title")}>
        <p>{t("diamonds_body")}</p>
        <WikiSubSectionTitle>{t("free_diamonds_title")}</WikiSubSectionTitle>
        <WikiSubSectionTitle>{t("free_diamonds_gameplay_title")}</WikiSubSectionTitle>
        <p>{t("free_diamonds_gameplay_body")}</p>
        <WikiSubSectionTitle>{t("watching_ads_title")}</WikiSubSectionTitle>
        <p>{t("watching_ads_body")}</p>
        <WikiSubSectionTitle>{t("news_subscriptions_title")}</WikiSubSectionTitle>
        <p>{t("news_subscriptions_body")}</p>
        <WikiSubSectionTitle>{t("social_media_title")}</WikiSubSectionTitle>
        <p>{t("social_media_body")}</p>
        <WikiSubSectionTitle>{t("upjers_portal_title")}</WikiSubSectionTitle>
        <p>{t("upjers_portal_body")}</p>
        <WikiSubSectionTitle>{t("buying_diamonds_title")}</WikiSubSectionTitle>
        <p>{t("buying_diamonds_body")}</p>
      </WikiCard>

      <WikiCard title={t("tickets_title")}>
        <p>{t("tickets_body")}</p>
      </WikiCard>

      <WikiCard title={t("keys_title")}>
        <p>{t("keys_body")}</p>
      </WikiCard>

      <WikiCard title={t("energy_title")}>
        <p>{t("energy_body")}</p>
      </WikiCard>

      <WikiCard title={t("feathers_title")}>
        <p>{t("feathers_body")}</p>
      </WikiCard>

      <WikiCard title={t("event_currency_title")}>
        <p>{t("event_currency_body")}</p>
      </WikiCard>
    </WikiContainer>
  );
}
