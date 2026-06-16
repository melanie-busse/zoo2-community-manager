import { describe, test, expect } from "vitest";
import { formatLocaleDate, toISODate } from "./DateUtil"; // Pfad ggf. anpassen

describe("Date Utilities", () => {
  // ==========================================
  // 1. FORMAT LOCALE DATE
  // ==========================================
  describe("formatLocaleDate", () => {
    const testDate = "2026-04-30T12:00:00.000Z";

    test("formatiert das Datum korrekt für Deutsch (de-DE)", () => {
      expect(formatLocaleDate(testDate, "de-DE")).toBe("30.04.2026");
    });

    test("formatiert das Datum korrekt für US-Englisch (en-US)", () => {
      expect(formatLocaleDate(testDate, "en-US")).toBe("04/30/2026");
    });

    test("formatiert das Datum korrekt für Dänisch (da-DK)", () => {
      expect(formatLocaleDate(testDate, "da-DK")).toBe("30.04.2026");
    });

    test("formatiert das Datum korrekt für Belgisches Französisch (fr-BE)", () => {
      expect(formatLocaleDate(testDate, "fr-BE")).toBe("30/04/2026");
    });

    test("nutzt de-DE als Standard-Locale, wenn keins übergeben wird", () => {
      expect(formatLocaleDate(testDate)).toBe("30.04.2026");
    });

    test("gibt einen leeren String zurück, wenn das Datum null oder leer ist", () => {
      expect(formatLocaleDate(null)).toBe("");
      expect(formatLocaleDate("")).toBe("");
    });

    test("gibt einen leeren String zurück, wenn ein ungültiges Datum übergeben wird", () => {
      expect(formatLocaleDate("kein-richtiges-datum")).toBe("");
    });
  });

  // ==========================================
  // 2. TO ISO DATE
  // ==========================================
  describe("toISODate", () => {
    test("extrahiert das reine YYYY-MM-DD Format aus einem Date-Objekt", () => {
      const date = new Date("2026-06-16T14:30:00.000Z");
      expect(toISODate(date)).toBe("2026-06-16");
    });

    test("extrahiert das reine YYYY-MM-DD Format aus einem ISO-String", () => {
      expect(toISODate("2026-12-24T18:00:00.000Z")).toBe("2026-12-24");
    });

    test("fängt Fehler bei ungültigen Eingaben ab und gibt einen leeren String zurück", () => {
      // Eine ungültige Eingabe bringt new Date().toISOString() zum Absturz,
      // der catch-Block fängt das ab
      expect(toISODate("ungültig")).toBe("");
    });
  });
});
