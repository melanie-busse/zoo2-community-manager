import { describe, test, expect, vi, beforeEach } from "vitest";
import { translateText } from "./translate";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const deeplSuccess = (translatedText: string) => ({
  ok: true,
  json: async () => ({ translations: [{ text: translatedText }] }),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DEEPL_API_KEY", "test-key:fx");
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
    mockFetch.mockResolvedValue(deeplSuccess("Löwe"));

    const result = await translateText("Lion", "de");
    expect(result).toBe("Löwe");
  });

  test("ruft die DeepL-API mit korrekter URL auf", async () => {
    mockFetch.mockResolvedValue(deeplSuccess("Löwe"));

    await translateText("Lion", "de");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("api-free.deepl.com");
    expect(calledUrl).toContain("translate");
  });

  test("sendet korrekte Zielsprache im Request-Body", async () => {
    mockFetch.mockResolvedValue(deeplSuccess("Komodo-Waran"));

    await translateText("Komodo Dragon", "de");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.target_lang).toBe("DE");
    expect(body.text).toEqual(["Komodo Dragon"]);
  });

  test("gibt Originaltext zurück wenn API-Key fehlt", async () => {
    vi.stubEnv("DEEPL_API_KEY", "");

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("gibt Originaltext zurück bei HTTP-Fehler (Fallback)", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503, text: async () => "Service Unavailable" });

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("gibt Originaltext zurück bei Netzwerkfehler (Fallback)", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const result = await translateText("Lion", "de");
    expect(result).toBe("Lion");
  });

  test("funktioniert mit verschiedenen Zielsprachen", async () => {
    mockFetch.mockResolvedValue(deeplSuccess("Leeuw"));

    const result = await translateText("Lion", "nl");
    expect(result).toBe("Leeuw");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.target_lang).toBe("NL");
  });
});
