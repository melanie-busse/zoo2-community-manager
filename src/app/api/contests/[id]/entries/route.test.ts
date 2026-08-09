import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { getEntriesByContestAndUser, createContestEntries } from "@/service/ContestService";

vi.mock("@/service/ContestService", () => ({
  getEntriesByContestAndUser: vi.fn(),
  createContestEntries: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Member" } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

const makeParams = (id: string) =>
  ({ params: Promise.resolve({ id }) }) as any;

describe("Contest Entries API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET
  // ==========================================

  describe("GET", () => {
    const mockEntries = [
      { id: 1, animalId: 10, level: 5, count: 3 },
      { id: 2, animalId: 11, level: 3, count: 7 },
    ];

    test("gibt Einträge für Contest und User zurück", async () => {
      vi.mocked(getEntriesByContestAndUser).mockResolvedValue(mockEntries as any);

      const request = new Request(
        "http://localhost:3000/api/contests/42/entries?userId=7",
      );
      const response = await GET(request, makeParams("42"));
      const data = await response.json();

      expect(getEntriesByContestAndUser).toHaveBeenCalledWith(42, 7);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockEntries);
    });

    test("gibt Status 400 zurück wenn userId fehlt", async () => {
      const request = new Request(
        "http://localhost:3000/api/contests/42/entries",
      );
      const response = await GET(request, makeParams("42"));

      expect(response.status).toBe(400);
    });

    test("gibt Status 400 zurück wenn contestId keine Zahl ist", async () => {
      const request = new Request(
        "http://localhost:3000/api/contests/abc/entries?userId=7",
      );
      const response = await GET(request, makeParams("abc"));

      expect(response.status).toBe(400);
    });

    test("gibt Status 500 zurück wenn der Service einen Fehler wirft", async () => {
      vi.mocked(getEntriesByContestAndUser).mockRejectedValue(new Error("DB-Fehler"));

      const request = new Request(
        "http://localhost:3000/api/contests/42/entries?userId=7",
      );
      const response = await GET(request, makeParams("42"));

      expect(response.status).toBe(500);
    });
  });

  // ==========================================
  // POST
  // ==========================================

  describe("POST", () => {
    const validBody = {
      userId: 7,
      entries: [
        { animalId: 10, level: 5, count: 3 },
        { animalId: 11, level: 3, count: 7 },
      ],
    };

    test("speichert Einträge und gibt Status 201 zurück", async () => {
      vi.mocked(createContestEntries).mockResolvedValue({ count: 2 } as any);

      const request = new Request("http://localhost:3000/api/contests/42/entries", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      const response = await POST(request, makeParams("42"));
      const data = await response.json();

      expect(createContestEntries).toHaveBeenCalledWith(42, 7, validBody.entries);
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    test("gibt Status 401 zurück wenn keine Session vorhanden", async () => {
      const { getServerSession } = await import("next-auth/next");
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const request = new Request("http://localhost:3000/api/contests/42/entries", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      const response = await POST(request, makeParams("42"));

      expect(response.status).toBe(401);
    });

    test("gibt Status 400 zurück wenn userId fehlt", async () => {
      const request = new Request("http://localhost:3000/api/contests/42/entries", {
        method: "POST",
        body: JSON.stringify({ entries: validBody.entries }),
      });
      const response = await POST(request, makeParams("42"));

      expect(response.status).toBe(400);
    });

    test("gibt Status 400 zurück wenn entries leer ist", async () => {
      const request = new Request("http://localhost:3000/api/contests/42/entries", {
        method: "POST",
        body: JSON.stringify({ userId: 7, entries: [] }),
      });
      const response = await POST(request, makeParams("42"));

      expect(response.status).toBe(400);
    });

    test("gibt Status 400 zurück wenn contestId keine Zahl ist", async () => {
      const request = new Request("http://localhost:3000/api/contests/abc/entries", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      const response = await POST(request, makeParams("abc"));

      expect(response.status).toBe(400);
    });

    test("gibt Status 500 zurück wenn der Service einen Fehler wirft", async () => {
      vi.mocked(createContestEntries).mockRejectedValue(new Error("DB-Fehler"));

      const request = new Request("http://localhost:3000/api/contests/42/entries", {
        method: "POST",
        body: JSON.stringify(validBody),
      });
      const response = await POST(request, makeParams("42"));

      expect(response.status).toBe(500);
    });
  });
});