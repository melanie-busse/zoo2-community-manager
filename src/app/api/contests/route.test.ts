import { describe, test, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { createContest } from "@/service/ContestService";

vi.mock("@/service/ContestService", () => ({
  createContest: vi.fn(),
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

describe("POST /api/contests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("erstellt einen Contest und gibt 201 zurück", async () => {
    const mockContest = { id: 1, startDate: "2026-01-01", endDate: "2026-12-31" };
    vi.mocked(createContest).mockResolvedValue(mockContest as any);

    const request = new Request("http://localhost:3000/api/contests", {
      method: "POST",
      body: JSON.stringify({ startDate: "2026-01-01", endDate: "2026-12-31", statuenIds: [1] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.contest).toEqual(mockContest);
    expect(createContest).toHaveBeenCalledTimes(1);
  });

  test("gibt 401 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/contests", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(createContest).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(createContest).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/contests", {
      method: "POST",
      body: JSON.stringify({ startDate: "2026-01-01", endDate: "2026-12-31", statuenIds: [1] }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});