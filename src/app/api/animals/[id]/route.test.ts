import { describe, test, expect, vi, beforeEach } from "vitest";

import { PUT } from "./route";
import { updateAnimal } from "@/service/AnimalService";

vi.mock("@/service/AnimalService", () => ({
  updateAnimal: vi.fn(),
}));

describe("Animal Dynamic PUT API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Aktualisiert ein Tier erfolgreich mit Status 200", async () => {
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify({ nameDe: "Erdmännchen (Neu)", biomeId: 10 }),
    });

    const response = await PUT(request, { params: { id: "42" } });
    const data = await response.json();

    expect(updateAnimal).toHaveBeenCalledWith(42, { nameDe: "Erdmännchen (Neu)", biomeId: 10 });
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "Tier erfolgreich aktualisiert", id: 42 });
  });

  test("Gibt Status 400 zurück, wenn die ID keine Zahl ist", async () => {
    const request = new Request("http://localhost:3000/api/animals/abc", {
      method: "PUT",
      body: JSON.stringify({ nameDe: "Test", biomeId: 1 }),
    });

    const response = await PUT(request, { params: { id: "abc" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Ungültige Tier-ID");
    expect(updateAnimal).not.toHaveBeenCalled();
  });

  test("Gibt Status 400 zurück, wenn Pflichtfelder fehlen", async () => {
    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify({ nameDe: "Unvollständig" }), // biomeId fehlt!
    });

    const response = await PUT(request, { params: { id: "42" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Name (DE) und Gehegetyp sind Pflichtfelder.");
    expect(updateAnimal).not.toHaveBeenCalled();
  });

  test("Gibt Status 500 zurück, wenn beim Update ein DB-Fehler auftritt", async () => {
    vi.mocked(updateAnimal).mockRejectedValue(new Error("Datenbank-Timeout"));

    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify({ nameDe: "Löwe", biomeId: 12 }),
    });

    const response = await PUT(request, { params: { id: "42" } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Fehler beim Aktualisieren des Tieres");
    expect(data.error).toBe("Datenbank-Timeout");
  });
});
