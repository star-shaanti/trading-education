import { SITE_URL } from "@/lib/i18n";
import { LANGUAGES, type Lang } from "@/lib/i18n/languages";

/**
 * Données structurées (schema.org) et métadonnées sociales réutilisables.
 * Module pur : utilisable dans les Server Components et les routes.
 */

export const SITE_NAME = "Trading Education";

/** Visuel Open Graph par défaut (généré par `app/opengraph-image.tsx`). */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Trading Education — analyses, rapports et webinaires gratuits",
};

/** Locale Open Graph d'une langue (`fr_FR`, `de_DE`, `hi_IN`…). */
export function ogLocale(lang: Lang): string {
  return (LANGUAGES.find((language) => language.code === lang)?.locale ?? "fr-FR").replace("-", "_");
}

/**
 * Bloc `openGraph` commun : un `openGraph` défini dans une page **remplace**
 * celui du layout, il faut donc y réintégrer le visuel, le nom du site et la
 * locale (sinon `og:image` disparaît).
 */
export function openGraphBase(lang: Lang, type: "website" | "article" = "website") {
  return {
    type,
    siteName: SITE_NAME,
    locale: ogLocale(lang),
    images: [OG_IMAGE],
  };
}

/** Description de l'organisation (affichée dans le Knowledge Panel / SERP). */
export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon.svg`,
  },
  description:
    "Plateforme éducative de trading : analyses de marché, rapports PDF, webinaires et outils gratuits, sans paywall.",
  email: "support@tradingeducationpro.com",
  foundingDate: "2025",
  sameAs: [`${SITE_URL}/a-propos`, `${SITE_URL}/ressources`],
} as const;

/** `Organization` + `WebSite` (+ recherche interne) : injectés sur tout le site. */
export function siteJsonLd() {
  return [
    { "@context": "https://schema.org", ...ORGANIZATION },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: ["fr", "en", "es", "de", "it", "hi", "ar", "ru"],
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/analyses?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

/** Fil d'Ariane structuré (rich result « breadcrumb »). */
export function breadcrumbJsonLd(items: { name: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href === "/" ? "/" : item.href}` } : {}),
    })),
  };
}

/** Auteur d'un contenu (E-E-A-T) : `author` / `reviewedBy` dans les JSON-LD. */
export function authorJsonLd(name?: string | null) {
  return name
    ? { "@type": "Person", name, url: SITE_URL }
    : { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
}

/** Liste ordonnée (pages listes : analyses, rapports, guides). */
export function itemListJsonLd(
  items: { name: string; url: string }[],
  name: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
