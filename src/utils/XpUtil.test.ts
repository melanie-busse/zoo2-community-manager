import { describe, test, expect } from "vitest";
import { sumXP } from "./XpUtil";
import { Xp } from "@/types/xp";

describe("sumXP", () => {
  test("rechnet alle XP-Werte im Array korrekt zusammen", () => {
    const mockXpArray = [{ xpValue: 100 }, { xpValue: 250 }, { xpValue: 50 }] as Xp[];

    expect(sumXP(mockXpArray)).toBe(400);
  });

  test("ignoriert Einträge, bei denen xpValue null, undefined oder unvollständig ist", () => {
    const mockXpWithFlaws = [
      { xpValue: 100 },
      { xpValue: undefined },
      { xpValue: null },
      { somethingElse: 50 },
    ] as any[] as Xp[];

    expect(sumXP(mockXpWithFlaws)).toBe(100);
  });

  test("gibt 0 zurück, wenn das Array leer ist", () => {
    expect(sumXP([])).toBe(0);
  });

  test("fängt null oder undefined stabil ab und gibt 0 zurück", () => {
    expect(sumXP(null)).toBe(0);
    expect(sumXP(undefined)).toBe(0);
  });
});
