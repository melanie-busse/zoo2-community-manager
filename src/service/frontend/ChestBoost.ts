import type { ChestBoostCreateInput, ChestBoostUpdateInput } from "@/types/chestBoost";

export async function createChestBoostOnClient(data: ChestBoostCreateInput): Promise<any> {
  const response = await fetch("/api/chest-boosts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function updateChestBoostOnClient(
  id: number,
  data: ChestBoostUpdateInput,
): Promise<any> {
  const response = await fetch(`/api/chest-boosts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function deleteChestBoostOnClient(id: number): Promise<void> {
  const response = await fetch(`/api/chest-boosts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}
