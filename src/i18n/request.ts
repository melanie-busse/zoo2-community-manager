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
  "contestfaq",
  "academyfaq",
  "visitorfaq",
  "gamefaq",
  "clubfaq",
  "adventcalendar",
  "animaltrades",
  "breeding",
  "bulldozer",
  "chestsfaq",
  "conservationweek",
  "currency",
  "fashionboutique",
  "friends",
  "icecreamvendor",
  "kujalipark",
  "loginrewards",
  "noctaviachests",
  "prizewheel",
  "questsfaq",
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
  "terraquachests",
  "videochests",
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
