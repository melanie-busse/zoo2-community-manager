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
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      active: data.active,

      conteststatue: {
        create: data.statuenIds.map((id: number) => ({
          statueId: id,
        })),
      },
    },
  });
}

export async function updateContest(id: number, data: any) {
  return prisma.contest.update({
    where: { id: id },
    data: {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      active: data.active,

      conteststatue: {
        // 1. Alle alten Verknüpfungen für diesen Wettbewerb entfernen
        deleteMany: {},

        create: data.statuenIds.map((id: number) => ({
          statueId: id,
        })),
      },
    },
  });
}

export async function deleteContest(id: number) {
  return prisma.contest.delete({
    where: { id },
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

export async function getContestById(id: string, locale: string = "de") {
  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        conteststatue: {
          include: {
            statue: {
              include: {
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
            },
          },
        },
      },
    });

    if (!contest) {
      console.warn(`Wettbewerb mit ID ${id} nicht gefunden.`);
      return null;
    }

    return contest;
  } catch (error) {
    console.error(`Fehler in getContestById für ID ${id}:`, error);
    throw error;
  }
}
