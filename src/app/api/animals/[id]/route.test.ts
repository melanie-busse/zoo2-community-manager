import { describe, test, expect, vi, beforeEach } from "vitest";

import { PUT, DELETE } from "./route";
import { updateAnimal, deleteAnimal } from "@/service/AnimalService";

vi.mock("@/service/AnimalService", () => ({
  updateAnimal: vi.fn(),
  deleteAnimal: vi.fn(),
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

const validBody = {
  biomeId: 10,
  animaltext: [{ languageCode: "de", animalName: "Erdmännchen (Neu)", animalDescription: "" }],
};

describe("Animal Dynamic PUT API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Aktualisiert ein Tier erfolgreich mit Status 200", async () => {
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "42" }) });
    const data = await response.json();

    expect(updateAnimal).toHaveBeenCalledWith(42, validBody);
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "animal.update_success", id: 42 });
  });

  test("Gibt Status 400 zurück, wenn die ID keine Zahl ist", async () => {
    const request = new Request("http://localhost:3000/api/animals/abc", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "abc" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("animal.invalid_id");
    expect(updateAnimal).not.toHaveBeenCalled();
  });

  test("Gibt Status 400 zurück, wenn Pflichtfelder fehlen", async () => {
    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify({ animaltext: [{ languageCode: "de", animalName: "Unvollständig" }] }), // biomeId fehlt!
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "42" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("animal.required_fields");
    expect(updateAnimal).not.toHaveBeenCalled();
  });

  test("Gibt Status 500 zurück, wenn beim Update ein DB-Fehler auftritt", async () => {
    vi.mocked(updateAnimal).mockRejectedValue(new Error("Datenbank-Timeout"));

    const request = new Request("http://localhost:3000/api/animals/42", {
      method: "PUT",
      body: JSON.stringify({ biomeId: 12, animaltext: [{ languageCode: "de", animalName: "Löwe", animalDescription: "" }] }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "42" }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("animal.update_error");
    expect(data.error).toBe("Datenbank-Timeout");
  });
});

describe("Animal Dynamic DELETE API Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Löscht ein Tier erfolgreich mit Status 204", async () => {
    vi.mocked(deleteAnimal).mockResolvedValue({} as any);

    const request = new Request("http://localhost:3000/api/animals/42", { method: "DELETE" });

    const response = await DELETE(request, { params: Promise.resolve({ id: "42" }) });

    expect(deleteAnimal).toHaveBeenCalledWith(42);
    expect(response.status).toBe(204);
  });

  test("Gibt Status 400 zurück, wenn die ID keine Zahl ist", async () => {
    const request = new Request("http://localhost:3000/api/animals/abc", { method: "DELETE" });

    const response = await DELETE(request, { params: Promise.resolve({ id: "abc" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("animal.invalid_id");
    expect(deleteAnimal).not.toHaveBeenCalled();
  });

  test("Gibt Status 500 zurück, wenn beim Löschen ein DB-Fehler auftritt", async () => {
    vi.mocked(deleteAnimal).mockRejectedValue(new Error("Constraint-Verletzung"));

    const request = new Request("http://localhost:3000/api/animals/42", { method: "DELETE" });

    const response = await DELETE(request, { params: Promise.resolve({ id: "42" }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("animal.delete_error");
    expect(data.error).toBe("Constraint-Verletzung");
  });
});