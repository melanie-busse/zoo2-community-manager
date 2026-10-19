async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.error ?? "Request failed"), { data });
  }
  return res.json();
}

export async function createOriginOnClient(data: object) {
  return handleResponse(
    await fetch("/api/origins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function updateOriginOnClient(id: number, data: object) {
  return handleResponse(
    await fetch(`/api/origins/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteOriginOnClient(id: number) {
  return handleResponse(await fetch(`/api/origins/${id}`, { method: "DELETE" }));
}
