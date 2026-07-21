import { describe, test, expect } from "vitest";
import { formatLocaleDate, toISODate, formatInitialDate, parseBackendDate } from "./DateUtil";

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

  // ==========================================
  // 4. PARSE BACKEND DATE
  // ==========================================
  describe("parseBackendDate", () => {
    test("gibt null zurück bei null", () => {
      expect(parseBackendDate(null)).toBeNull();
    });

    test("gibt null zurück bei undefined", () => {
      expect(parseBackendDate(undefined)).toBeNull();
    });

    test("gibt null zurück bei leerem String", () => {
      expect(parseBackendDate("")).toBeNull();
    });

    test("gibt null zurück bei reinem Leerzeichen", () => {
      expect(parseBackendDate("   ")).toBeNull();
    });

    test("gibt null zurück bei ungültigem Datum", () => {
      expect(parseBackendDate("kein-datum")).toBeNull();
      expect(parseBackendDate("32nd January 2024")).toBeNull();
    });

    test("parst ISO-Format YYYY-MM-DD", () => {
      const result = parseBackendDate("2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result!.getUTCFullYear()).toBe(2024);
      expect(result!.getUTCMonth()).toBe(0);
      expect(result!.getUTCDate()).toBe(15);
    });

    test("entfernt führende und nachgestellte Leerzeichen", () => {
      const result = parseBackendDate("  2024-06-15  ");
      expect(result).toBeInstanceOf(Date);
      expect(result!.getUTCFullYear()).toBe(2024);
    });

    test("parst Ordinalzahl 'st' (1st)", () => {
      const result = parseBackendDate("January 1st, 2024");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(false);
    });

    test("parst Ordinalzahl 'nd' (2nd)", () => {
      const result = parseBackendDate("February 2nd, 2024");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(false);
    });

    test("parst Ordinalzahl 'rd' (3rd)", () => {
      const result = parseBackendDate("March 3rd, 2024");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(false);
    });

    test("parst Ordinalzahl 'th' bei zweistelliger Zahl (21st)", () => {
      const result = parseBackendDate("April 21st, 2024");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(false);
    });

    test("parst Ordinalzahl 'th' am Monatsende (31st)", () => {
      const result = parseBackendDate("May 31st, 2024");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result!.getTime())).toBe(false);
    });
  });
});
