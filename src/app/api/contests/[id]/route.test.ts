import { describe, test, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";
import { updateContest, deleteContest } from "@/service/ContestService";

vi.mock("@/service/ContestService", () => ({
  updateContest: vi.fn(),
  deleteContest: vi.fn(),
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

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) }) as any;

describe("PUT /api/contests/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("aktualisiert einen Contest und gibt 200 zurück", async () => {
    const updatedContest = { id: 1, startDate: "2026-03-01", endDate: "2026-09-30" };
    vi.mocked(updateContest).mockResolvedValue(updatedContest as any);

    const request = new Request("http://localhost:3000/api/contests/1", {
      method: "PUT",
      body: JSON.stringify({ startDate: "2026-03-01", endDate: "2026-09-30", statuenIds: [2] }),
    });

    const response = await PUT(request, makeParams("1"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contest).toEqual(updatedContest);
    expect(updateContest).toHaveBeenCalledWith(1, expect.any(Object));
  });

  test("gibt 403 zurück wenn der User kein Director ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member" } } as any);

    const request = new Request("http://localhost:3000/api/contests/1", {
      method: "PUT",
      body: JSON.stringify({}),
    });

    const response = await PUT(request, makeParams("1"));

    expect(response.status).toBe(403);
    expect(updateContest).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/contests/1", {
      method: "PUT",
      body: JSON.stringify({}),
    });

    const response = await PUT(request, makeParams("1"));

    expect(response.status).toBe(403);
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(updateContest).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/contests/1", {
      method: "PUT",
      body: JSON.stringify({ startDate: "2026-01-01", endDate: "2026-12-31", statuenIds: [1] }),
    });

    const response = await PUT(request, makeParams("1"));

    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/contests/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("löscht einen Contest und gibt 200 zurück", async () => {
    vi.mocked(deleteContest).mockResolvedValue({ id: 5 } as any);

    const request = new Request("http://localhost:3000/api/contests/5");
    const response = await DELETE(request, makeParams("5"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(deleteContest).toHaveBeenCalledWith(5);
  });

  test("gibt 403 zurück wenn der User kein Director ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member" } } as any);

    const request = new Request("http://localhost:3000/api/contests/5");
    const response = await DELETE(request, makeParams("5"));

    expect(response.status).toBe(403);
    expect(deleteContest).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück bei ungültiger ID", async () => {
    const request = new Request("http://localhost:3000/api/contests/abc");
    const response = await DELETE(request, makeParams("abc"));

    expect(response.status).toBe(400);
    expect(deleteContest).not.toHaveBeenCalled();
  });

  test("gibt 404 zurück wenn Prisma P2025 wirft (nicht gefunden)", async () => {
    const prismaError = Object.assign(new Error("Not found"), { code: "P2025" });
    vi.mocked(deleteContest).mockRejectedValue(prismaError);

    const request = new Request("http://localhost:3000/api/contests/99");
    const response = await DELETE(request, makeParams("99"));

    expect(response.status).toBe(404);
  });

  test("gibt 500 zurück bei unbekanntem Fehler", async () => {
    vi.mocked(deleteContest).mockRejectedValue(new Error("Unbekannt"));

    const request = new Request("http://localhost:3000/api/contests/5");
    const response = await DELETE(request, makeParams("5"));

    expect(response.status).toBe(500);
  });
});