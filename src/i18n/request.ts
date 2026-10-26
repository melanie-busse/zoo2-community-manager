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
  "friendshipchests",
  "icecreamvendor",
  "kujalipark",
  "legendarychests",
  "loginrewards",
  "noctaviachests",
  "normalchests",
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
  "retrochests",
  "seasonpasshistory",
  "sparklinganimals",
  "terraineditor",
  "terraquachests",
  "videochests",
  "epicchests",
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
