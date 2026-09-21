import { DEFAULT_LANG, LANGUAGES, isLang, type Lang } from "./languages";

/**
 * Routage multilingue par URL : `/{langue}/...` (fr, en, es, de, it, hi, ar, ru).
 * Module pur (sans `next/headers`) : utilisé par le middleware, les Server
 * Components, les composants clients et les générateurs de liens.
 */

/** En-tête transmis par le middleware : langue déduite de l'URL. */
export const LOCALE_HEADER = "x-te-locale";

/**
 * Chemins hors périmètre linguistique : privé, transactionnel, technique.
 * Ils ne sont jamais préfixés par la langue (et restent en `noindex`).
 */
export const GLOBAL_PREFIXES = [
  "/api",
  "/admin",
  "/espace-membre",
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/newsletter",
  "/_next",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/manifest.json",
  "/robots.txt",
  "/sitemap",
  "/sitemaps",
  "/feed.xml",
  "/opengraph-image",
];

/** Vrai si le chemin ne doit pas porter de préfixe de langue. */
export function isGlobalPath(pathname: string): boolean {
  return GLOBAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}?`)
  );
}

/** Langue portée par l'URL (`/fr/analyses` → `fr`), sinon `null`. */
export function localeFromPath(pathname: string): Lang | null {
  const segment = pathname.split("/")[1] ?? "";
  return isLang(segment) ? (segment.toLowerCase() as Lang) : null;
}

/** Retire le préfixe de langue (`/fr/analyses` → `/analyses`). */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (!locale) return pathname || "/";
  const rest = pathname.slice(locale.length + 1);
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * Préfixe un chemin interne avec la langue.
 * Les chemins hors périmètre (privé, technique), les URL absolues, `mailto:`,
 * les ancres et les liens externes sont renvoyés tels quels.
 */
export function withLocale(pathname: string, lang: Lang): string {
  if (!pathname.startsWith("/")) return pathname; // externe, mailto:, #ancre
  if (pathname.startsWith("//")) return pathname;
  if (isGlobalPath(pathname)) return pathname;
  const clean = stripLocale(pathname.split("?")[0].split("#")[0]);
  const search = pathname.includes("?") ? pathname.slice(pathname.indexOf("?")) : "";
  return `/${lang}${clean === "/" ? "" : clean}${search}`;
}

/** URL localisée complète (avec domaine) — sitemaps, JSON-LD, emails. */
export function localizedUrl(pathname: string, lang: Lang, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const localized = withLocale(pathname, lang);
  return `${base}${localized}`;
}

/**
 * Alternates `hreflang` d'une page publique : une entrée par langue +
 * `x-default` (version par défaut du site). À passer à `alternates.languages`.
 */
export function languageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const language of LANGUAGES) {
    languages[language.locale] = withLocale(pathname, language.code);
  }
  languages["x-default"] = withLocale(pathname, DEFAULT_LANG);
  return languages;
}

/**
 * Bloc `alternates` prêt à l'emploi pour `generateMetadata` :
 * canonique auto-référent + hreflang vers toutes les langues.
 */
export function localizedAlternates(
  lang: Lang,
  canonicalPath: string
): { canonical: string; languages: Record<string, string> } {
  const path = canonicalPath.split("?")[0];
  return {
    canonical: withLocale(canonicalPath, lang),
    languages: languageAlternates(path),
  };
}
