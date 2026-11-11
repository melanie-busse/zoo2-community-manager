import type { PremiumVipAnimalEntryWithAnimal, BonusAnimalCreateInput } from "@/service/PremiumVipAnimalService";

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

async function throwIfNotOk(response: Response): Promise<void> {
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const error: any = new Error(result.message || "Request failed");
    error.status = response.status;
    throw error;
  }
}

export async function createBonusAnimal(data: BonusAnimalCreateInput): Promise<{ id: number }> {
  const response = await fetch("/api/premium-vip-animals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response);
  return response.json();
}

export async function updateBonusAnimal(id: number, data: BonusAnimalCreateInput): Promise<{ id: number }> {
  const response = await fetch(`/api/premium-vip-animals?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response);
  return response.json();
}

export async function deleteBonusAnimal(id: number): Promise<void> {
  const response = await fetch(`/api/premium-vip-animals?id=${id}`, {
    method: "DELETE",
  });
  await throwIfNotOk(response);
}
