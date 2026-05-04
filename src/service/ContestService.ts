import prisma from "@/lib/prisma";

export async function getAllContests(locale: string = "de") {
  const contests = await prisma.contest.findMany({
    include: {
      conteststatue: {
        include: {
          statue: {
            include: {
              animal: {
                include: {
                  biome: true,
                  animaltext: {
                    where: { languageCode: locale },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const now = new Date();
  return contests.sort((a, b) => {
    // 1. Prüfen, ob der Wettbewerb aktuell läuft
    const aAktiv = now >= new Date(a.startDate) && now <= new Date(a.endDate);
    const bAktiv = now >= new Date(b.startDate) && now <= new Date(b.endDate);

    // 2. Aktive Wettbewerbe immer nach oben
    if (aAktiv && !bAktiv) return -1;
    if (!aAktiv && bAktiv) return 1;

    // 3. Innerhalb der Gruppen (beide aktiv oder beide inaktiv) nach Startdatum sortieren (neueste zuerst)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

export async function createContest(data: any) {
  return prisma.contest.create({
    data: {
      startDate: new Date(data.start),
      endDate: new Date(data.ende),
      active: data.aktiv,

      conteststatue: {
        create: data.statuenIds.map((id: number) => ({
          statueId: id,
        })),
      },
    },
  });
}

export async function getAllStatues(locale: string = "de") {
  return prisma.statue.findMany({
    include: {
      statuetext: {
        where: { languageCode: locale },
      },
      animal: {
        include: {
          animaltext: {
            where: { languageCode: locale },
          },
          biome: {
            include: {
              biomestext: {
                where: { languageCode: locale },
              },
            },
          },
        },
      },
    },
  });
}
