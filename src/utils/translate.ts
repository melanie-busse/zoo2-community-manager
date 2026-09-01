/**
 * Übersetzt einen Text über die DeepL API.
 * Benötigt DEEPL_API_KEY in .env.local
 * Free Plan: 500.000 Zeichen/Monat kostenlos (deepl.com/pro-api)
 *
 * @param text - Der zu übersetzende englische Text
 * @param targetLang - Die Zielsprache (z.B. 'de', 'da', 'nl', 'fr', 'es')
 * @returns Der übersetzte Text oder der Originaltext als Fallback
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error("DEEPL_API_KEY is not set in .env.local");
    return text;
  }

  // DeepL Free API endpoint (für Free-Plan Keys die auf :fx enden)
  const isFreeKey = apiKey.endsWith(":fx");
  const baseUrl = isFreeKey
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  // DeepL erwartet Sprachcodes in Großbuchstaben, einige haben Sonderformen
  const langMap: Record<string, string> = {
    de: "DE",
    da: "DA",
    nl: "NL",
    fr: "FR",
    es: "ES",
    en: "EN",
  };
  const deeplTarget = langMap[targetLang] ?? targetLang.toUpperCase();

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: "EN",
        target_lang: deeplTarget,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`DeepL API Fehler (${res.status}): ${err}`);
      return text;
    }

    const data = (await res.json()) as { translations?: { text: string }[] };
    const translated = data.translations?.[0]?.text;
    if (translated && translated.trim() !== "") {
      return translated;
    }
  } catch (error) {
    console.error("DeepL nicht erreichbar:", error);
  }

  console.error(`Übersetzungsfehler (${targetLang}): DeepL fehlgeschlagen, verwende Originaltext.`);
  return text;
}
