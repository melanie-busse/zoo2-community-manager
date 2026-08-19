import { describe, test, expect, vi, beforeEach } from "vitest";

import { GET, PUT, DELETE } from "./route";
import { getSpecialCoatById, updateSpecialCoat } from "@/service/SpecialCoatsService";
import { prisma } from "@/lib/prisma";

vi.mock("@/service/SpecialCoatsService", () => ({
  getSpecialCoatById: vi.fn(),
  updateSpecialCoat: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    specialCoatsText: { deleteMany: vi.fn() },
    specialCoatOrigin: { deleteMany: vi.fn() },
    specialCoat: { delete: vi.fn() },
  },
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

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("SpecialCoats [id] API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET
  // ==========================================

  describe("GET", () => {
    test("gibt eine Farbvariante mit Status 200 zurück (Standard-Locale 'de')", async () => {
      const mockCoat = { id: 42, animalId: 5 };
      vi.mocked(getSpecialCoatById).mockResolvedValue(mockCoat as any);

      const request = new Request("http://localhost:3000/api/specialcoats/42");

      const response = await GET(request, makeParams("42"));
      const data = await response.json();

      expect(getSpecialCoatById).toHaveBeenCalledWith("42", "de");
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCoat);
    });

    test("nutzt das übergebene locale aus den Suchparametern", async () => {
      vi.mocked(getSpecialCoatById).mockResolvedValue({ id: 42 } as any);

      const request = new Request("http://localhost:3000/api/specialcoats/42?locale=en");

      await GET(request, makeParams("42"));

      expect(getSpecialCoatById).toHaveBeenCalledWith("42", "en");
    });

    test("gibt Status 404 zurück, wenn die Farbvariante nicht gefunden wurde", async () => {
      vi.mocked(getSpecialCoatById).mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/specialcoats/99");

      const response = await GET(request, makeParams("99"));
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe("specialcoat.not_found");
    });

    test("gibt Status 500 zurück, wenn der Service einen Fehler wirft", async () => {
      vi.mocked(getSpecialCoatById).mockRejectedValue(new Error("DB Error"));

      const request = new Request("http://localhost:3000/api/specialcoats/42");

      const response = await GET(request, makeParams("42"));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("errors.load_error");
    });
  });

  // ==========================================
  // PUT
  // ==========================================

  describe("PUT", () => {
    const validBody = {
      animalId: 5,
      releaseDate: "2026-06-01",
      image: "polar.png",
      originIds: [1, 2],
      texts: [{ languageCode: "de", name: "Polarfuchs", color: "Weiß" }],
    };

    const mockUpdatedCoat = {
      id: 42,
      specialcoatstext: [{ name: "Polarfuchs" }],
      specialcoatsorigin: [],
    };

    test("delegiert an updateSpecialCoat und gibt das Ergebnis mit Status 200 zurück", async () => {
      vi.mocked(updateSpecialCoat).mockResolvedValue(mockUpdatedCoat as any);

      const request = new Request("http://localhost:3000/api/specialcoats/42", {
        method: "PUT",
        body: JSON.stringify(validBody),
      });

      const response = await PUT(request, makeParams("42"));
      const data = await response.json();

      expect(updateSpecialCoat).toHaveBeenCalledWith("42", validBody);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedCoat);
    });

    test("gibt Status 400 zurück, wenn updateSpecialCoat eine ungültige ID meldet", async () => {
      vi.mocked(updateSpecialCoat).mockRejectedValue(
        new Error("updateSpecialCoat aborted: Invalid ID: abc"),
      );

      const request = new Request("http://localhost:3000/api/specialcoats/abc", {
        method: "PUT",
        body: JSON.stringify(validBody),
      });

      const response = await PUT(request, makeParams("abc"));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("errors.invalid_id");
    });

    test("gibt Status 500 zurück, wenn updateSpecialCoat einen DB-Fehler wirft", async () => {
      vi.mocked(updateSpecialCoat).mockRejectedValue(new Error("DB Error"));

      const request = new Request("http://localhost:3000/api/specialcoats/42", {
        method: "PUT",
        body: JSON.stringify(validBody),
      });

      const response = await PUT(request, makeParams("42"));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("specialcoat.update_error");
    });
  });

  // ==========================================
  // DELETE
  // ==========================================

  describe("DELETE", () => {
    beforeEach(() => {
      vi.mocked(prisma.$transaction).mockResolvedValue(undefined as any);
    });

    test("löscht eine Farbvariante erfolgreich mit Status 200", async () => {
      const request = new Request("http://localhost:3000/api/specialcoats/42", {
        method: "DELETE",
      });

      const response = await DELETE(request, makeParams("42"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    test("gibt Status 400 zurück, wenn die ID keine Zahl ist", async () => {
      const request = new Request("http://localhost:3000/api/specialcoats/abc", {
        method: "DELETE",
      });

      const response = await DELETE(request, makeParams("abc"));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("errors.invalid_id");
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    test("gibt Status 500 zurück, wenn ein DB-Fehler auftritt", async () => {
      vi.mocked(prisma.$transaction).mockRejectedValue(new Error("Löschfehler"));

      const request = new Request("http://localhost:3000/api/specialcoats/42", {
        method: "DELETE",
      });

      const response = await DELETE(request, makeParams("42"));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("specialcoat.delete_error");
    });
  });
});