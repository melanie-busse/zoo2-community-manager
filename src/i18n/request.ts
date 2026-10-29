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
  "visitorfaq",
  "wiki_game",
  "wiki_club",
  "adventcalendar",
  "animaltrades",
  "breeding",
  "bulldozer",
  "wiki_chests",
  "conservationweek",
  "wiki_currency",
  "fashionboutique",
  "friends",
  "icecreamvendor",
  "kujalipark",
  "loginrewards",
  "prizewheel",
  "wiki_quests",
  "rescuecenter",
  "seasonpass",
  "superdeals",
  "vipanimals",
  "wikicollections",
  "diamonds",
  "rainforestpark",
  "videoads",
  "seasonpasshistory",
  "sparklinganimals",
  "terraineditor",
  "chestBoosts",
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
