async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.error ?? "Request failed"), { data });
  }
  return res.json();
}

export async function createBiomeOnClient(data: object) {
  return handleResponse(
    await fetch("/api/biomes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateBiomeOnClient(id: number, data: object) {
  return handleResponse(
    await fetch(`/api/biomes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteBiomeOnClient(id: number) {
  return handleResponse(await fetch(`/api/biomes/${id}`, { method: "DELETE" }));
}
