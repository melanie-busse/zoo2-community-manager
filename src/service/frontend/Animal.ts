import { showSuccessToast } from "@/utils/alerts";

export async function createAnimalOnClient(formData: any): Promise<any> {
  const response = await fetch("/api/animals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Fehler beim Erstellen");
  }

  showSuccessToast("Tier erfolgreich erstellt!");
  return result;
}

export async function updateAnimalOnClient(id: number, formData: any): Promise<any> {
  const response = await fetch(`/api/animals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Fehler beim Updaten");
  }

  showSuccessToast("Tier erfolgreich aktualisiert!");
  return result;
}

export async function deleteAnimalOnClient(id: number): Promise<void> {
  const response = await fetch(`/api/animals/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Fehler beim Löschen");
  }
}