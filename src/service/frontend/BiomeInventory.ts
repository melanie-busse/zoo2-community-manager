import { BiomeInventoryField } from "@/service/BiomeInventoryService";

export async function updateBiomeInventoryOnClient(
  biomeId: number,
  field: BiomeInventoryField,
  value: boolean | number,
): Promise<void> {
  const response = await fetch("/api/zooInventory/biomes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ biomeId, field, value }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message ?? "Fehler beim Speichern");
  }
}

export async function updateBiomeGameInventoryOnClient(
  biomeGameId: number,
  count: number,
): Promise<void> {
  const response = await fetch("/api/zooInventory/biomes/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ biomeGameId, count }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message ?? "Fehler beim Speichern");
  }
}
