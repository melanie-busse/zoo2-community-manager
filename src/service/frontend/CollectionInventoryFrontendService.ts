export async function toggleCollectionRequirement(
  requirementId: number,
  completed: boolean
): Promise<void> {
  await fetch(`/api/zooInventory/collections/${requirementId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}
