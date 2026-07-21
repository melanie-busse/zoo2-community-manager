import { describe, test, expect, vi, beforeEach } from "vitest";
import { translateText } from "./translate";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const myMemorySuccess = (translatedText: string) => ({
  ok: true,
  json: async () => ({ responseData: { translatedText }, responseStatus: 200 }),
});

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
    mockFetch.mockResolvedValue(myMemorySuccess("Löwe"));

    const result = await translateText("Lion", "de");
    expect(result).toBe("Löwe");
  });

  test("ruft die MyMemory-API mit korrekter URL auf", async () => {
    mockFetch.mockResolvedValue(myMemorySuccess("Löwe"));

    await translateText("Lion", "de");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("mymemory.translated.net");
    expect(calledUrl).toContain("q=Lion");
    expect(calledUrl).toContain("langpair=en|de");
  });

  test("encoded Sonderzeichen in der URL", async () => {
    mockFetch.mockResolvedValue(myMemorySuccess("Komodo-Waran"));

    await translateText("Komodo Dragon", "de");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("Komodo%20Dragon");
  });

  test("gibt Originaltext zurück wenn responseStatus nicht 200", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ responseData: { translatedText: "QUERY LENGTH LIMIT EXCEEDED" }, responseStatus: 403 }),
    });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("gibt Originaltext zurück bei HTTP-Fehler (Fallback)", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503 });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("gibt Originaltext zurück bei Netzwerkfehler (Fallback)", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("funktioniert mit verschiedenen Zielsprachen", async () => {
    mockFetch.mockResolvedValue(myMemorySuccess("Leeuw"));

    const result = await translateText("Lion", "nl");
    expect(result).toBe("Leeuw");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("langpair=en|nl");
  });
});