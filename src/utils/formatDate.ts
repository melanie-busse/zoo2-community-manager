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
