import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

export type BonusAnimalsResponse = {
  entries: PremiumVipAnimalEntryWithAnimal[];
  total: number;
  availableYears: number[];
};

export async function fetchBonusAnimals(
  type: "PREMIUM" | "VIP",
  params: { animalName?: string; year?: number; page: number; pageSize: number }
): Promise<BonusAnimalsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("type", type);
  searchParams.set("page", String(params.page));
  searchParams.set("pageSize", String(params.pageSize));
  if (params.animalName) searchParams.set("animalName", params.animalName);
  if (params.year !== undefined) searchParams.set("year", String(params.year));

  const response = await fetch(`/api/premium-vip-animals?${searchParams.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.error || "Failed to load bonus animals");
    error.status = response.status;
    throw error;
  }

  return result;
}
