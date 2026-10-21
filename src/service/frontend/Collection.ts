async function handleResponse(res: Response) {
  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error: any = new Error(result.message ?? "Request failed");
    error.status = res.status;
    error.data = result;
    throw error;
  }
  return result;
}

export async function createCollectionOnClient(data: object): Promise<{ id: number }> {
  return handleResponse(
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateCollectionOnClient(id: number, data: object): Promise<void> {
  await handleResponse(
    await fetch(`/api/collections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteCollectionOnClient(id: number): Promise<void> {
  const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message ?? "Delete failed");
  }
}
