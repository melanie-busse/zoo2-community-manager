import "server-only";
import { prisma } from "@/lib/prisma";

export type MayorQuestItem = {
  id: number;
  sortOrder: number;
  titleName: string;
  level: number;
  coinReward: number;
  xpReward: number;
  miscReward: string;
  questName: string;
  objectives: { id: number; sortOrder: number; text: string }[];
};

export async function getAllMayorQuests(locale: string): Promise<MayorQuestItem[]> {
  const quests = await prisma.mayorQuest.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      objectives: { orderBy: { sortOrder: "asc" } },
      texts: { where: { languageCode: locale } },
    },
  });

  return quests.map((q) => {
    const text = q.texts[0];
    return {
      id: q.id,
      sortOrder: q.sortOrder,
      titleName: text?.titleName ?? q.titleName,
      level: q.level,
      coinReward: q.coinReward,
      xpReward: q.xpReward,
      miscReward: text?.miscReward ?? q.miscReward,
      questName: text?.questName ?? q.questName,
      objectives: q.objectives.map((o) => ({
        id: o.id,
        sortOrder: o.sortOrder,
        text: o.text,
      })),
    };
  });
}
