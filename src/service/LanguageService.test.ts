import { vi, describe, test, expect, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

import { getAllLanguages } from "./LanguageService";

vi.mock("@/lib/prisma", () => ({
  default: {
    language: {
      findMany: vi.fn(),
    },
  },
}));

describe("Language Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getAllLanguages sollte alle Sprachen alphabetisch aufsteigend sortiert zurückgeben", async () => {
    const mockLanguages = [
      { code: "de", name: "Deutsch" },
      { code: "en", name: "English" },
      { code: "fr", name: "Français" },
    ];

    vi.mocked(prisma.language.findMany).mockResolvedValue(mockLanguages as any);

    const result = await getAllLanguages();

    expect(prisma.language.findMany).toHaveBeenCalledWith({
      orderBy: {
        name: "asc",
      },
    });

    expect(result).toEqual(mockLanguages);
  });

  test("sollte ein leeres Array zurückgeben und den Fehler loggen, wenn Prisma einen Fehler wirft", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(prisma.language.findMany).mockRejectedValue(new Error("Database connection lost"));

    const result = await getAllLanguages();

    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Fehler im LanguageService:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
