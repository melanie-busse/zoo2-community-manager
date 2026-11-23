import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const namespaces = [
  "admin",
  "animal",
  "biome",
  "specialCoat",
  "contest",
  "navigation",
  "page",
  "common",
  "api",
  "user",
  "zooStatistic",
  "inventoryStatistic",
  "collections",
  "region",
  "terrain",
  "game",
  "decoration",
  "origin",
  "shop",
  "levelup",
  "mayorquest",
  "wiki_contest",
  "wiki_academy",
  "wiki_game",
  "wiki_club",
  "wiki_animal",
  "wiki_chests",
  "wiki_conservation",
  "wiki_currency",
  "wiki_quests",
  "wiki_seasonpass",
  "wikicollections",
  "chestBoosts",
  "animals_bonus",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages: Record<string, unknown> = {};
  for (const ns of namespaces) {
    messages[ns] = (await import(`../../messages/${locale}/${ns}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
