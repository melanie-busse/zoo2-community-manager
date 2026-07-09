export async function createSpecialCoatOnClient(formData: any): Promise<any> {
  const response = await fetch("/api/specialcoats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function updateSpecialCoatOnClient(id: number, formData: any): Promise<any> {
  const response = await fetch(`/api/specialcoats/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function deleteSpecialCoatOnClient(id: number): Promise<void> {
  const response = await fetch(`/api/specialcoats/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}
