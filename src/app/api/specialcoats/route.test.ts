import { describe, test, expect, vi, beforeEach } from "vitest";

import { GET, POST } from "./route";
import { getAllSpecialCoats, createSpecialCoat } from "@/service/SpecialCoatsService";

vi.mock("@/service/SpecialCoatsService", () => ({
  getAllSpecialCoats: vi.fn(),
  createSpecialCoat: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director" } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

describe("SpecialCoats API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET
  // ==========================================

  describe("GET", () => {
    test("gibt Farbvarianten erfolgreich mit Status 200 zurück (Standard-Locale 'de')", async () => {
      const mockCoats = [{ id: 1, animalId: 5 }];
      vi.mocked(getAllSpecialCoats).mockResolvedValue(mockCoats as any);

      const request = new Request("http://localhost:3000/api/specialcoats");

      const response = await GET(request);
      const data = await response.json();

      expect(getAllSpecialCoats).toHaveBeenCalledWith("de");
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCoats);
    });

    test("nutzt das übergebene locale aus den Suchparametern", async () => {
      vi.mocked(getAllSpecialCoats).mockResolvedValue([]);

      const request = new Request("http://localhost:3000/api/specialcoats?locale=en");

      const response = await GET(request);

      expect(getAllSpecialCoats).toHaveBeenCalledWith("en");
      expect(response.status).toBe(200);
    });

    test("gibt Status 500 zurück, wenn der Service einen Fehler wirft", async () => {
      vi.mocked(getAllSpecialCoats).mockRejectedValue(new Error("Datenbank down"));

      const request = new Request("http://localhost:3000/api/specialcoats");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "errors.load_error" });
    });
  });

  // ==========================================
  // POST
  // ==========================================

  describe("POST", () => {
    const validBody = {
      animalId: 5,
      texts: [{ languageCode: "de", name: "Polarfuchs", color: "Weiß" }],
    };

    test("erstellt eine Farbvariante erfolgreich (Status 201)", async () => {
      vi.mocked(createSpecialCoat).mockResolvedValue({ id: 77 } as any);

      const request = new Request("http://localhost:3000/api/specialcoats", {
        method: "POST",
        body: JSON.stringify(validBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(createSpecialCoat).toHaveBeenCalledWith(validBody);
      expect(response.status).toBe(201);
      expect(data).toEqual({ id: 77 });
    });

    test("gibt Status 400 zurück, wenn animalId fehlt", async () => {
      const request = new Request("http://localhost:3000/api/specialcoats", {
        method: "POST",
        body: JSON.stringify({ texts: [{ languageCode: "de", name: "Polarfuchs" }] }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("specialcoat.required_fields");
      expect(createSpecialCoat).not.toHaveBeenCalled();
    });

    test("gibt Status 400 zurück, wenn texts fehlt", async () => {
      const request = new Request("http://localhost:3000/api/specialcoats", {
        method: "POST",
        body: JSON.stringify({ animalId: 5 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("specialcoat.required_fields");
      expect(createSpecialCoat).not.toHaveBeenCalled();
    });

    test("gibt Status 400 zurück, wenn texts ein leeres Array ist", async () => {
      const request = new Request("http://localhost:3000/api/specialcoats", {
        method: "POST",
        body: JSON.stringify({ animalId: 5, texts: [] }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("specialcoat.required_fields");
    });

    test("gibt Status 500 zurück, wenn beim Speichern ein DB-Fehler auftritt", async () => {
      vi.mocked(createSpecialCoat).mockRejectedValue(new Error("Schreibfehler"));

      const request = new Request("http://localhost:3000/api/specialcoats", {
        method: "POST",
        body: JSON.stringify(validBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("specialcoat.create_error");
    });
  });
});