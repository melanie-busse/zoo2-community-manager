import { describe, test, expect, vi, beforeEach } from "vitest";

import { GET, POST } from "./route";
import { getAllAnimals, createAnimal } from "@/service/AnimalService";

vi.mock("@/service/AnimalService", () => ({
  getAllAnimals: vi.fn(),
  createAnimal: vi.fn(),
}));

describe("Animals API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    test("Gibt Tiere erfolgreich mit Status 200 zurück (Standard-Locale 'de')", async () => {
      const mockAnimals = [{ id: 1, name: "Erdmännchen" }];
      vi.mocked(getAllAnimals).mockResolvedValue(mockAnimals as any);

      const request = new Request("http://localhost:3000/api/animals");

      const response = await GET(request);
      const data = await response.json();

      expect(getAllAnimals).toHaveBeenCalledWith("de");
      expect(response.status).toBe(200);
      expect(data).toEqual(mockAnimals);
    });

    test("Nutzt das übergebene locale aus den Suchparametern", async () => {
      vi.mocked(getAllAnimals).mockResolvedValue([]);

      const request = new Request("http://localhost:3000/api/animals?locale=en");

      const response = await GET(request);

      expect(getAllAnimals).toHaveBeenCalledWith("en");
      expect(response.status).toBe(200);
    });

    test("Gibt Status 500 zurück, wenn der Service einen Fehler wirft", async () => {
      vi.mocked(getAllAnimals).mockRejectedValue(new Error("Datenbank down"));

      const request = new Request("http://localhost:3000/api/animals");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Fehler beim Laden" });
    });
  });

  describe("POST", () => {
    test("Erstellt ein Tier erfolgreich (Status 201)", async () => {
      vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);

      const request = new Request("http://localhost:3000/api/animals", {
        method: "POST",
        body: JSON.stringify({ nameDe: "Löwe", enclosureType: 3 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(createAnimal).toHaveBeenCalledWith({ nameDe: "Löwe", enclosureType: 3 });
      expect(response.status).toBe(201);
      expect(data).toEqual({ id: 99 });
    });

    test("Gibt Status 400 zurück, wenn Pflichtfelder fehlen", async () => {
      const request = new Request("http://localhost:3000/api/animals", {
        method: "POST",
        body: JSON.stringify({ nameDe: "Unvollständig" }), // enclosureType fehlt!
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Name (DE) und Gehegetyp sind Pflichtfelder.");
      expect(createAnimal).not.toHaveBeenCalled();
    });

    test("Gibt Status 500 zurück, wenn beim Speichern ein DB-Fehler auftritt", async () => {
      vi.mocked(createAnimal).mockRejectedValue(new Error("Schreibfehler"));

      const request = new Request("http://localhost:3000/api/animals", {
        method: "POST",
        body: JSON.stringify({ nameDe: "Tiger", enclosureType: 1 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Fehler beim Erstellen des Tieres");
    });
  });
});
