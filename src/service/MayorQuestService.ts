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
  dialogText: string | null;
  objectives: { id: number; sortOrder: number; text: string; imagePath: string | null }[];
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
      dialogText: text?.dialogText ?? null,
      objectives: q.objectives.map((o) => ({
        id: o.id,
        sortOrder: o.sortOrder,
        text: o.text,
        imagePath: o.imagePath ?? null,
      })),
    };
  });
}
