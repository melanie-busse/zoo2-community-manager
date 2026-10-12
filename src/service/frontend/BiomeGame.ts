async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.error ?? "Request failed"), { data });
  }
  return res.json();
}

export async function createBiomeGameOnClient(data: object) {
  return handleResponse(
    await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateBiomeGameOnClient(id: number, data: object) {
  return handleResponse(
    await fetch(`/api/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}
