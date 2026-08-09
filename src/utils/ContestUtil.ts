import { Animal } from "@/types/animal";
import { ContestDonation } from "@/types/contest";
import { RankedUser } from "@/types/user";

export function getStatueName(animal: Animal, fallback: string) {
  return animal.animaltext?.[0]?.animalName || fallback;
}

export interface AnimalStats {
  rankedUser: RankedUser[];
  totalWeighted: number;
}

interface UserAccumulator {
  [id: number]: {
    name: string;
    rawSum: number;
  };
}

export function calculateAnimalStats(
  animalId: number,
  results?: ContestDonation[] | null,
): AnimalStats {
  if (!results) return { rankedUser: [], totalWeighted: 0 };

  const animalResults = results.filter((result) => result.animal.id === animalId);

  const memberMap = animalResults.reduce<UserAccumulator>((acc, contestResult) => {
    const mId = contestResult.user?.id || 0;

    if (!acc[mId]) {
      acc[mId] = {
        name: contestResult.user?.upjersname || contestResult.user?.name || `User #${mId}`,
        rawSum: 0,
      };
    }

    acc[mId].rawSum += (contestResult.level ?? 0) * (contestResult.count ?? 0);
    return acc;
  }, {});

  const sorted = Object.values(memberMap).sort((a, b) => b.rawSum - a.rawSum);

  let totalWeighted = 0;
  const rankedUsers: RankedUser[] = sorted.map((m, index) => {
    const multiplier = 10 * Math.max(1, 4 - index);
    const weighted = m.rawSum * multiplier;
    totalWeighted += weighted;

    return { ...m, multiplier, weighted };
  });

  return { rankedUser: rankedUsers, totalWeighted };
}
