/**
 * Übersetzt einen Text über MyMemory (kostenlos, kein API-Key nötig).
 * Fallback: LibreTranslate public instance, dann Originaltext.
 *
 * @param text - Der zu übersetzende englische Text
 * @param targetLang - Die Zielsprache (z.B. 'de', 'da', 'nl', 'fr', 'es')
 * @returns Der übersetzte Text oder der Originaltext als Fallback
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  // MyMemory: 1.000 Wörter/Tag anonym, 10.000 Wörter/Tag mit E-Mail (MYMEMORY_EMAIL in .env.local)
  try {
    const email = process.env.MYMEMORY_EMAIL ? `&de=${encodeURIComponent(process.env.MYMEMORY_EMAIL)}` : "";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}${email}`;
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });

    if (res.ok) {
      const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
      const translated = data.responseData?.translatedText;
      // MyMemory gibt bei Fehlern manchmal den Originaltext zurück mit Status != 200
      if (translated && data.responseStatus === 200) return translated;
    }
    console.warn(`MyMemory antwortete mit Status: ${res.status}`);
  } catch (error) {
    console.warn("MyMemory nicht erreichbar:", error);
  }

  console.error(`Übersetzungsfehler (${targetLang}): Alle Dienste fehlgeschlagen, verwende Originaltext.`);
  return text;
}
