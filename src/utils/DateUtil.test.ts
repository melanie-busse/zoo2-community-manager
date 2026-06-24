import { describe, test, expect } from "vitest";
import { formatLocaleDate, toISODate, formatInitialDate } from "./DateUtil"; // Pfad ggf. anpassen

describe("Date Utilities", () => {
  // Wir nutzen einen UTC-String, um Zeitzonen-Verschiebungen im Test-Runner zu vermeiden
  const testDate = "2026-04-30T12:00:00.000Z";

  // ==========================================
  // 1. FORMAT LOCALE DATE
  // ==========================================
  describe("formatLocaleDate", () => {
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
      // Explizit mit Uhrzeit mitten am Tag, damit Zeitzonen-Shifts das Datum nicht verfälschen
      const date = new Date("2026-06-16T14:30:00.000Z");
      expect(toISODate(date)).toBe("2026-06-16");
    });

    test("extrahiert das reine YYYY-MM-DD Format aus einem ISO-String", () => {
      expect(toISODate("2026-12-24T18:00:00.000Z")).toBe("2026-12-24");
    });

    test("fängt Fehler bei ungültigen Eingaben ab und gibt einen leeren String zurück", () => {
      expect(toISODate("ungültig")).toBe("");
    });
  });

  // ==========================================
  // 3. FORMAT INITIAL DATE
  // ==========================================
  describe("formatInitialDate", () => {
    test("gibt einen leeren String bei Falsy-Werten zurück", () => {
      expect(formatInitialDate(null)).toBe("");
      expect(formatInitialDate(undefined)).toBe("");
      expect(formatInitialDate("")).toBe("");
    });

    test("formatiert ein gültiges Date-Objekt zu YYYY-MM-DD", () => {
      const date = new Date("2026-03-07T10:00:00.000Z");
      expect(formatInitialDate(date)).toBe("2026-03-07");
    });

    test("fängt ein ungültiges Date-Objekt ab", () => {
      const invalidDate = new Date("kein-datum");
      expect(formatInitialDate(invalidDate)).toBe("");
    });

    test("schneidet den Zeit-Teil von einem ISO-String ab", () => {
      expect(formatInitialDate("2026-08-15T23:59:59.000Z")).toBe("2026-08-15");
    });

    test("gibt einen reinen Datums-String unverändert zurück", () => {
      expect(formatInitialDate("2026-11-12")).toBe("2026-11-12");
    });
  });
});
