/**
 * Übersetzt einen Text über die kostenlose Lingva-API (Google Translate Proxy)
 *
 * @param text - Der zu übersetzende englische Text
 * @param targetLang - Die Zielsprache (z.B. 'de', 'da', 'nl', 'fr', 'es')
 * @returns Der übersetzte Text oder der Originaltext als Fallback
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://lingva.ml/api/v1/en/${targetLang}/${encodedText}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Lingva antwortete mit Status: ${res.status}`);
    }

    const data = (await res.json()) as { translation?: string };

    return data.translation || text;
  } catch (error) {
    console.error(`Lingva-Übersetzungsfehler (${targetLang}):`, error);
    // Fallback auf das Original, damit der Import nicht komplett abbricht,
    // falls die API mal kurz Schluckauf hat.
    return text;
  }
}
