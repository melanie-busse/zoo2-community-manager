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

export async function getAllMayorQuests(): Promise<MayorQuestItem[]> {
  const quests = await prisma.mayorQuest.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      objectives: { orderBy: { sortOrder: "asc" } },
    },
  });

  return quests.map((q) => ({
    id: q.id,
    sortOrder: q.sortOrder,
    titleName: q.titleName,
    level: q.level,
    coinReward: q.coinReward,
    xpReward: q.xpReward,
    miscReward: q.miscReward,
    questName: q.questName,
    objectives: q.objectives.map((o) => ({
      id: o.id,
      sortOrder: o.sortOrder,
      text: o.text,
    })),
  }));
}
