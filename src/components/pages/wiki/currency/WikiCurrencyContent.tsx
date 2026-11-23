"use client";

import { useTranslations } from "next-intl";
import React from "react";

import WikiContainer from "@/components/pages/wiki/_elements/WikiContainer";
import WikiHeader from "@/components/pages/wiki/_elements/WikiHeader";
import CurrencyCoins from "@/components/pages/wiki/currency/CurrencyCoins";
import CurrencyDiamonds from "@/components/pages/wiki/currency/CurrencyDiamonds";
import CurrencyTickets from "@/components/pages/wiki/currency/CurrencyTickets";
import CurrencyKeys from "@/components/pages/wiki/currency/CurrencyKeys";
import CurrencyFeathers from "@/components/pages/wiki/currency/CurrencyFeathers";
import CurrencyEnergy from "@/components/pages/wiki/currency/CurrencyEnergy";
import CurrencyEvent from "@/components/pages/wiki/currency/CurrencyEvent";

export default function WikiCurrencyContent() {
  const t = useTranslations("wiki_currency");

  return (
    <WikiContainer>
      <WikiHeader title={t("title")} introParagraph={t("intro")} />

      <CurrencyCoins />
      <CurrencyDiamonds />
      <CurrencyTickets />
      <CurrencyKeys />
      <CurrencyEnergy />
      <CurrencyFeathers />
      <CurrencyEvent />
    </WikiContainer>
  );
}
