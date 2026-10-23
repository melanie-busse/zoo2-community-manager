import "server-only";
import { prisma } from "@/lib/prisma";

export type MayorQuestItem = {
  id: number;
  sortOrder: number;
  titleName: string;
  level: number;
  coinReward: number;
  diamondReward: number;
  ticketReward: number;
  energyReward: number;
  xpReward: number;
  questName: string;
  dialogText: string | null;
  objectives: { id: number; sortOrder: number; text: string; imagePath: string | null }[];
  rewards: { id: number; sortOrder: number; imagePath: string; amount: number }[];
};

export async function getAllMayorQuests(locale: string): Promise<MayorQuestItem[]> {
  const quests = await prisma.mayorQuest.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      objectives: {
          orderBy: { sortOrder: "asc" },
          include: { texts: { where: { languageCode: locale } } },
        },
      rewards: { orderBy: { sortOrder: "asc" } },
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
      diamondReward: q.diamondReward,
      ticketReward: q.ticketReward,
      energyReward: q.energyReward,
      xpReward: q.xpReward,
      questName: text?.questName ?? q.questName,
      dialogText: text?.dialogText ?? null,
      objectives: q.objectives.map((o) => ({
        id: o.id,
        sortOrder: o.sortOrder,
        text: o.texts[0]?.text ?? o.text,
        imagePath: o.imagePath ?? null,
      })),
      rewards: q.rewards.map((r) => ({
        id: r.id,
        sortOrder: r.sortOrder,
        imagePath: r.imagePath,
        amount: r.amount,
      })),
    };
  });
}
