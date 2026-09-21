import { cookies, headers } from "next/headers";
import { LANG_COOKIE, langLocale, normalizeLang, isLang, type Lang } from "@/lib/i18n/languages";
import { LOCALE_HEADER } from "@/lib/i18n/locale-path";

/**
 * i18n côté serveur.
 *
 * La langue vient d'abord de **l'URL** (`/{langue}/...`, transmise par le
 * middleware dans l'en-tête `x-te-locale`), puis du cookie `te_lang` (préférence
 * utilisateur, utilisée pour rediriger les URLs historiques), puis du défaut.
 * Le HTML initial est donc toujours dans la langue de l'URL (SEO + hreflang).
 *
 * Langues supportées : fr, en, es, de, it, hi, ar (RTL), ru — voir
 * `lib/i18n/languages.ts` (métadonnées), `lib/i18n/locale-path.ts` (routage) et
 * `lib/i18n/dict` (traductions).
 *
 * ⚠️ Ce module utilise `next/headers` : réservé aux Server Components et aux
 * routes API. Les composants clients importent `@/lib/i18n/dict` (module pur).
 */
export * from "@/lib/i18n/languages";
export * from "@/lib/i18n/locale-path";
export { dictionaries, getDict } from "@/lib/i18n/dict";
export type { Dict, HomeCardText } from "@/lib/i18n/dict";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tradingeducationpro.com";

export function getLang(): Lang {
  try {
    const fromUrl = headers().get(LOCALE_HEADER);
    if (isLang(fromUrl)) return fromUrl.toLowerCase() as Lang;
    return normalizeLang(cookies().get(LANG_COOKIE)?.value);
  } catch {
    return "fr";
  }
}

export const TZ_COOKIE = "te_tz";
export const DEFAULT_TIMEZONE = "Europe/Paris";

/**
 * Fuseau horaire du visiteur : cookie `te_tz` alimenté côté navigateur par
 * `<TimezoneSync />`, puis validé ici (format IANA attendu).
 * Repli sur Europe/Paris si absent ou invalide.
 */
export function normalizeTimezone(value?: string | null): string {
  if (!value) return DEFAULT_TIMEZONE;
  const candidate = decodeURIComponent(value);
  if (!/^[A-Za-z][A-Za-z0-9_+-]*(?:\/[A-Za-z0-9_+-]+)*$/.test(candidate)) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("fr-FR", { timeZone: candidate });
    return candidate;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function getVisitorTimezone(): string {
  try {
    return normalizeTimezone(cookies().get(TZ_COOKIE)?.value);
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * Sélectionne la variante traduite d'un contenu éditorial.
 * Les contenus stockés en base ne disposent que des versions FR/EN : les autres
 * langues d'interface reçoivent l'anglais (repli international).
 */
export function pick<T>(
  lang: Lang,
  enValue: T | null | undefined,
  frValue: T | null | undefined
): T | undefined {
  return (lang === "fr" ? frValue ?? enValue : enValue ?? frValue) ?? undefined;
}

const localeOf = (lang: Lang) => langLocale(lang);

/** `timeZone` peut être forcé (ex. fuseau du webinaire) ; sinon celui du visiteur. */
export function formatDate(
  date: Date | string | null | undefined,
  lang: Lang,
  timeZone?: string
): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeOf(lang), {
    dateStyle: "long",
    timeZone: timeZone ?? getVisitorTimezone(),
  }).format(value);
}

export function formatDateTime(
  date: Date | string | null | undefined,
  lang: Lang,
  timeZone?: string
): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeOf(lang), {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: timeZone ?? getVisitorTimezone(),
  }).format(value);
}

/**
 * Libellé court du fuseau, affiché à côté d'une date (ex. « UTC+2 ») :
 * volontairement indépendant de la langue de l'interface.
 */
export function timeZoneLabel(timeZone: string): string {
  try {
    return (
      new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")?.value ?? timeZone
    );
  } catch {
    return timeZone;
  }
}

export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(localeOf(lang)).format(value);
}
