export interface XpEntry {
  key: "feed" | "play" | "clean";
  icon: string;
}

export const XP: Record<number, XpEntry> = {
  1: { key: "feed", icon: "/images/icons/feed.png" },
  2: { key: "play", icon: "/images/icons/play.png" },
  3: { key: "clean", icon: "/images/icons/clean.png" },
};
