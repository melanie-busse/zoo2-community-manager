import prisma from "@/lib/prisma";

export async function getContestSpecialCoats(locale: string = "de") {
  return prisma.specialCoat.findMany({
    where: { isContestSpecialCoat: true },
    include: {
      specialcoatstext: {
        where: { languageCode: locale },
      },
      animal: {
        include: {
          animaltext: {
            where: { languageCode: locale },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function getAllContests(locale: string = "de") {
  const contests = await prisma.contest.findMany({
    include: {
      conteststatue: {
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
      contestspecialcoat: {
        include: {
          specialcoat: {
            include: {
              specialcoatstext: {
                where: { languageCode: locale },
              },
              animal: {
                include: {
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
      active: data.active ? 1 : 0,

      conteststatue: {
        create: data.statuenIds.map((id: number) => ({
          animalId: id,
        })),
      },

      contestspecialcoat: {
        create: (data.specialCoatIds ?? []).map((id: number) => ({
          specialCoatId: id,
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
      active: data.active ? 1 : 0,

      conteststatue: {
        deleteMany: {},
        create: data.statuenIds.map((id: number) => ({
          animalId: id,
        })),
      },

      contestspecialcoat: {
        deleteMany: {},
        create: (data.specialCoatIds ?? []).map((id: number) => ({
          specialCoatId: id,
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
  return prisma.animal.findMany({
    where: { isContestAnimal: true },
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
    orderBy: { id: "asc" },
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
        contestspecialcoat: {
          include: {
            specialcoat: {
              include: {
                specialcoatstext: {
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

export async function getResultsByContestId(id: string) {
  return prisma.contestDonation.findMany({
    where: { contestId: parseInt(id) },
    include: {
      animal: true,
      user: {
        select: {
          upjersname: true,
          name: true,
          id: true,
        },
      },
    },
  });
}

export async function getMembers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      upjersname: true,
    },
    orderBy: [{ upjersname: "asc" }, { name: "asc" }],
  });
}

export async function getEntriesByContestAndUser(contestId: number, userId: number) {
  return prisma.contestDonation.findMany({
    where: { contestId, userId },
    select: {
      id: true,
      animalId: true,
      level: true,
      count: true,
    },
  });
}

export async function createContestEntries(
  contestId: number,
  userId: number,
  entries: Array<{ animalId: number; level: number; count: number }>,
) {
  return prisma.contestDonation.createMany({
    data: entries.map((e) => ({
      contestId,
      userId,
      animalId: e.animalId,
      level: e.level,
      count: e.count,
    })),
  });
}
