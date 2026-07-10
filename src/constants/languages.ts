export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "de", name: "DE", flag: "fi-de" },
  { code: "en", name: "EN", flag: "fi-gb" },
  { code: "da", name: "DA", flag: "fi-dk" },
  { code: "fr", name: "FR", flag: "fi-fr" },
  { code: "nl", name: "NL", flag: "fi-nl" },
  { code: "es", name: "ES", flag: "fi-es" },
];

export const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

export const FLAG_MAP: Record<string, string> = SUPPORTED_LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang.flag;
    return acc;
  },
  {} as Record<string, string>,
);
