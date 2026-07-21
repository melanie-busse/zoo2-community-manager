/**
 * Formatiert ein Datum basierend auf dem Sprachkürzel (Locale)
 * de-DE -> 30.04.2026
 * en-US -> 04/30/2026
 * da-DK -> 30.04.2026
 * fr-BE -> 30/04/2026
 */
export const formatLocaleDate = (date: Date | string | null, locale: string = "de-DE"): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

export const toISODate = (dateInput: string | Date) => {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export const formatInitialDate = (date: any) => {
  if (!date) return "";

  if (date instanceof Date) {
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
  }

  const dateString = String(date);
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
};

/**
 * Konvertiert einen Datums-String (z.B. aus dem Fandom Wiki) in ein valides JavaScript Date-Objekt.
 * Liefert null zurück, falls der String ungültig oder leer ist, damit Prisma nicht abstürzt.
 */
export const parseBackendDate = (dateInput: string | null | undefined): Date | null => {
  if (!dateInput) return null;

  let cleanedInput = dateInput.trim();
  if (cleanedInput === "") return null;

  cleanedInput = cleanedInput.replace(/(\d+)(st|nd|rd|th)\b/i, "$1");
  const parsedDate = new Date(cleanedInput);
  return !isNaN(parsedDate.getTime()) ? parsedDate : null;
};
