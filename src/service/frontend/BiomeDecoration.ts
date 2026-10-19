async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.error ?? "Request failed"), { data });
  }
  return res.json();
}

export async function createBiomeDecorationOnClient(data: object) {
  return handleResponse(
    await fetch("/api/decorations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateBiomeDecorationOnClient(id: number, data: object) {
  return handleResponse(
    await fetch(`/api/decorations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteBiomeDecorationOnClient(id: number) {
  return handleResponse(await fetch(`/api/decorations/${id}`, { method: "DELETE" }));
}
