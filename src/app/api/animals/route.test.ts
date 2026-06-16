import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { getAllAnimals } from "@/service/AnimalService";

// 1. Den AnimalService mocken
vi.mock("@/service/AnimalService", () => ({
  getAllAnimals: vi.fn(),
}));

describe("Animals API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Gibt Tiere erfolgreich mit Status 200 zurück (Standard-Locale 'de')", async () => {
    const mockAnimals = [{ id: 1, name: "Erdmännchen" }];
    vi.mocked(getAllAnimals).mockResolvedValue(mockAnimals as any);

    // Einen Next.js-kompatiblen Request simulieren
    const request = new Request("http://localhost:3000/api/animals");

    const response = await GET(request);
    const data = await response.json();

    // Prüfen, ob der Service mit dem Standard-Wert "de" aufgerufen wurde
    expect(getAllAnimals).toHaveBeenCalledWith("de");
    // Prüfen, ob der HTTP-Status 200 ist
    expect(response.status).toBe(200);
    // Prüfen, ob die Daten übereinstimmen
    expect(data).toEqual(mockAnimals);
  });

  test("Nutzt das übergebene locale aus den Suchparametern", async () => {
    vi.mocked(getAllAnimals).mockResolvedValue([]);

    // Request mit ?locale=en simulieren
    const request = new Request("http://localhost:3000/api/animals?locale=en");

    const response = await GET(request);

    // Prüfen, ob das locale korrekt extrahiert und weitergegeben wurde
    expect(getAllAnimals).toHaveBeenCalledWith("en");
    expect(response.status).toBe(200);
  });

  test("Gibt Status 500 zurück, wenn der Service einen Fehler wirft", async () => {
    // Einen Datenbankfehler simulieren
    vi.mocked(getAllAnimals).mockRejectedValue(new Error("Datenbank down"));

    const request = new Request("http://localhost:3000/api/animals");

    const response = await GET(request);
    const data = await response.json();

    // Prüfen, ob der catch-Block gegriffen hat
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Fehler beim Laden" });
  });
});
