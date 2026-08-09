export async function createContestOnClient(formData: any): Promise<any> {
  const response = await fetch("/api/contests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function updateContestOnClient(id: number, formData: any): Promise<any> {
  const response = await fetch(`/api/contests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function getContestEntriesForUser(
  contestId: number,
  userId: number,
): Promise<Array<{ id: number; animalId: number; level: number; count: number }>> {
  const response = await fetch(`/api/contests/${contestId}/entries?userId=${userId}`);
  if (!response.ok) return [];
  return response.json();
}

export async function submitContestEntries(
  contestId: number,
  userId: number,
  entries: Array<{ animalId: number; level: number; count: number }>,
): Promise<void> {
  const response = await fetch(`/api/contests/${contestId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, entries }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}

export async function deleteContestOnClient(id: number): Promise<void> {
  const response = await fetch(`/api/contests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}
