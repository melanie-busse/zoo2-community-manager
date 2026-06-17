"use client";

import { useLocale } from "next-intl";

/**
 * Formatiert Zahlen international, OHNE Nachkommastellen
 */

interface FormattedNumberProps {
  value: number;
}

export default function FormattedNumber({ value }: FormattedNumberProps) {
  // Holt das aktuelle Locale (z.B. "de" oder "en") direkt von next-intl
  const locale = useLocale();

  if (value === undefined || value === null) return null;

  try {
    const formatted = value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return <span>{formatted}</span>;
  } catch (error) {
    // Fallback: Zeige die rohe Zahl
    return <span>{value}</span>;
  }
}
