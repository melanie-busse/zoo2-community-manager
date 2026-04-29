import prisma from "@/lib/prisma";

export async function getAllContests() {
  const contests = await prisma.contest.findMany({
    include: {
      conteststatue: {
        include: {
          statue: {
            include: {
              animal: {
                include: {
                  biome: true,
                  animaltext: true },
              },
            },
          },
        },
      },
    },
  });

  const now = new Date();

  // Manuelle Sortierung, da Prisma "isAktiv" nicht direkt in der DB kenn
  return contests.sort((a, b) => {
    const aAktiv = now >= new Date(a.startDate) && now <= new Date(a.endDate);
    const bAktiv = now >= new Date(b.startDate) && now <= new Date(b.endDate);

    // 1. Wenn einer aktiv ist und der andere nicht, kommt der aktive nach oben
    if (aAktiv && !bAktiv) return -1;
    if (!aAktiv && bAktiv) return 1;

    // 2. Wenn beide gleich aktiv/inaktiv sind, sortiere nach Startdatum (neueste zuerst)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}
