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

export async function createShopOnClient(data: object): Promise<any> {
  return handleResponse(
    await fetch("/api/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateShopOnClient(id: number, data: object): Promise<any> {
  return handleResponse(
    await fetch(`/api/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteShopOnClient(id: number): Promise<void> {
  const res = await fetch(`/api/shops/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message ?? "Delete failed");
  }
}
