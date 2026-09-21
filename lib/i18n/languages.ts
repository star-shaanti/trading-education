/**
 * Langues supportées par le site (module pur : utilisable côté serveur ET client).
 * Ajouter une langue = ajouter une entrée ici + un dictionnaire dans lib/i18n/dict.
 */

export type Lang = "fr" | "en" | "es" | "de" | "it" | "hi" | "ar" | "ru";

export type Dir = "ltr" | "rtl";

export type LanguageMeta = {
  code: Lang;
  /** Nom anglais de la langue (utilisé dans les métadonnées). */
  label: string;
  /** Nom dans la langue elle-même (menu de sélection). */
  nativeLabel: string;
  flag: string;
  /** Balise locale utilisée par Intl (dates, nombres). */
  locale: string;
  dir: Dir;
};

export const LANGUAGES: LanguageMeta[] = [
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷", locale: "fr-FR", dir: "ltr" },
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧", locale: "en-GB", dir: "ltr" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸", locale: "es-ES", dir: "ltr" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪", locale: "de-DE", dir: "ltr" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹", locale: "it-IT", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳", locale: "hi-IN", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦", locale: "ar-EG", dir: "rtl" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺", locale: "ru-RU", dir: "ltr" },
];

export const DEFAULT_LANG: Lang = "fr";

/** Cookie de préférence de langue (aussi utilisé pour rediriger les URLs historiques). */
export const LANG_COOKIE = "te_lang";

const BY_CODE = new Map<string, LanguageMeta>(LANGUAGES.map((language) => [language.code, language]));

/** Vrai si la valeur est un code de langue supporté. */
export function isLang(value?: string | null): value is Lang {
  return typeof value === "string" && BY_CODE.has(value.toLowerCase().slice(0, 2));
}

/** Normalise « en-GB », « FR », « ar-SA »… en code supporté (repli sur la langue par défaut). */
export function normalizeLang(value?: string | null): Lang {
  if (!value) return DEFAULT_LANG;
  const code = value.toLowerCase().slice(0, 2);
  return BY_CODE.has(code) ? (code as Lang) : DEFAULT_LANG;
}

export function languageMeta(lang: Lang): LanguageMeta {
  return BY_CODE.get(lang) ?? BY_CODE.get(DEFAULT_LANG)!;
}

export function langLocale(lang: Lang): string {
  return languageMeta(lang).locale;
}

export function isRtl(lang: Lang): boolean {
  return languageMeta(lang).dir === "rtl";
}

export function dirOf(lang: Lang): Dir {
  return languageMeta(lang).dir;
}
