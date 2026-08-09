import { describe, test, expect } from "vitest";
import { calculateAnimalStats } from "./ContestUtil";

const makeDonation = (
  animalId: number,
  userId: number,
  name: string,
  level: number,
  count: number,
) => ({
  animal: { id: animalId },
  user: { id: userId, upjersname: name, name },
  level,
  count,
});

describe("calculateAnimalStats", () => {
  test("gibt leeres Ergebnis zurück, wenn results undefined ist", () => {
    const result = calculateAnimalStats(1, undefined);
    expect(result.rankedUser).toHaveLength(0);
    expect(result.totalWeighted).toBe(0);
  });

  test("gibt leeres Ergebnis zurück, wenn keine Einträge für das Tier vorhanden sind", () => {
    const donations = [makeDonation(2, 1, "Luna", 5, 10)];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser).toHaveLength(0);
    expect(result.totalWeighted).toBe(0);
  });

  test("summiert Einträge desselben Users korrekt", () => {
    const donations = [
      makeDonation(1, 1, "Luna", 3, 2), // rawSum += 6
      makeDonation(1, 1, "Luna", 4, 5), // rawSum += 20 → rawSum = 26
    ];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser).toHaveLength(1);
    expect(result.rankedUser[0].rawSum).toBe(26);
  });

  test("sortiert User nach rawSum absteigend", () => {
    const donations = [
      makeDonation(1, 1, "Luna", 1, 5),   // rawSum = 5
      makeDonation(1, 2, "Milo", 2, 10),  // rawSum = 20
      makeDonation(1, 3, "Nico", 3, 3),   // rawSum = 9
    ];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser[0].name).toBe("Milo");
    expect(result.rankedUser[1].name).toBe("Nico");
    expect(result.rankedUser[2].name).toBe("Luna");
  });

  test("berechnet Multiplikator korrekt (Platz 1: ×40, 2: ×30, 3: ×20, 4+: ×10)", () => {
    const donations = [
      makeDonation(1, 1, "A", 10, 1), // rawSum=10, Platz 1 → ×40
      makeDonation(1, 2, "B", 5, 1),  // rawSum=5,  Platz 2 → ×30
      makeDonation(1, 3, "C", 3, 1),  // rawSum=3,  Platz 3 → ×20
      makeDonation(1, 4, "D", 1, 1),  // rawSum=1,  Platz 4 → ×10
    ];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser[0].multiplier).toBe(40);
    expect(result.rankedUser[1].multiplier).toBe(30);
    expect(result.rankedUser[2].multiplier).toBe(20);
    expect(result.rankedUser[3].multiplier).toBe(10);
  });

  test("berechnet gewichtete Punkte und Gesamtpunktzahl korrekt", () => {
    const donations = [
      makeDonation(1, 1, "A", 10, 1), // rawSum=10, ×40 = 400
      makeDonation(1, 2, "B", 5, 1),  // rawSum=5,  ×30 = 150
    ];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser[0].weighted).toBe(400);
    expect(result.rankedUser[1].weighted).toBe(150);
    expect(result.totalWeighted).toBe(550);
  });

  test("filtert Einträge anderer Tiere heraus", () => {
    const donations = [
      makeDonation(1, 1, "Luna", 5, 2),
      makeDonation(2, 2, "Milo", 5, 2), // anderes Tier
    ];
    const result = calculateAnimalStats(1, donations as any);
    expect(result.rankedUser).toHaveLength(1);
    expect(result.rankedUser[0].name).toBe("Luna");
  });

  test("nutzt upjersname wenn vorhanden, sonst name", () => {
    const donations = [
      { animal: { id: 1 }, user: { id: 1, upjersname: "UpjersName", name: "DiscordName" }, level: 1, count: 1 },
      { animal: { id: 1 }, user: { id: 2, upjersname: null, name: "NurDiscord" }, level: 1, count: 1 },
    ];
    const result = calculateAnimalStats(1, donations as any);
    const names = result.rankedUser.map((u) => u.name);
    expect(names).toContain("UpjersName");
    expect(names).toContain("NurDiscord");
  });
});