import { RegionInventoryField } from "@/service/RegionInventoryService";

export async function updateRegionInventoryOnClient(
  regionId: number,
  field: RegionInventoryField,
  value: boolean | number | null,
): Promise<void> {
  const response = await fetch("/api/zooInventory/regions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ regionId, field, value }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message ?? "Fehler beim Speichern");
  }
}
