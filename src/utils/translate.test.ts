import { describe, test, expect, vi, beforeEach } from "vitest";
import { translateText } from "./translate";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("translateText", () => {
  test("gibt leeren String zurück bei leerem Input", async () => {
    const result = await translateText("", "de");
    expect(result).toBe("");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("gibt leeren String zurück bei nur Leerzeichen", async () => {
    const result = await translateText("   ", "de");
    expect(result).toBe("");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("gibt übersetzten Text zurück bei Erfolg", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ translation: "Löwe" }),
    });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Löwe");
  });

  test("ruft die Lingva-API mit korrekter URL auf", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ translation: "Löwe" }),
    });

    await translateText("Lion", "de");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://lingva.ml/api/v1/en/de/Lion",
      expect.objectContaining({ method: "GET" })
    );
  });

  test("encoded Sonderzeichen in der URL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ translation: "Komodo-Waran" }),
    });

    await translateText("Komodo Dragon", "de");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("Komodo%20Dragon");
  });

  test("gibt Originaltext zurück wenn translation fehlt in der Antwort", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("gibt Originaltext zurück bei HTTP-Fehler (Fallback)", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("gibt Originaltext zurück bei Netzwerkfehler (Fallback)", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("funktioniert mit verschiedenen Zielsprachen", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ translation: "Leeuw" }),
    });

    const result = await translateText("Lion", "nl");
    expect(result).toBe("Leeuw");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/en/nl/");
  });
});