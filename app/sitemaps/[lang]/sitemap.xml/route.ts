import { GUIDE_PATHS } from "@/lib/guides";
import { SITE_URL } from "@/lib/i18n";
import { LANGUAGES, isLang } from "@/lib/i18n/languages";
import { languageAlternates, withLocale } from "@/lib/i18n/locale-path";
import { prisma } from "@/lib/prisma";
import { isGuideArticle } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Sitemap d'une langue : `/sitemaps/{langue}/sitemap.xml`.
 * Chaque URL porte les `xhtml:link rel="alternate" hreflang` des 8 langues :
 * signal recommandé par Google pour le contenu multilingue (en complément des
 * balises `hreflang` du `<head>`).
 */

type Entry = {
  path: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const STATIC_PATHS: Entry[] = [
  { path: "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { path: "/analyses", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { path: "/rapports", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { path: "/webinaires", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { path: "/guides", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { path: "/outils", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { path: "/recap", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  { path: "/ressources", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { path: "/a-propos", lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { path: "/confidentialite", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { path: "/mentions-legales", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { path: "/politiques", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Guides pédagogiques : contenu éditorial réel, déclaré aux moteurs même quand
 * l'import en base n'a pas été joué (`npm run db:import-guides`). Les doublons
 * éventuels — guide présent à la fois ici et en base — sont éliminés plus bas.
 */
const GUIDE_ENTRIES: Entry[] = GUIDE_PATHS.map((path) => ({
  path,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.7,
}));

/** Échappe les valeurs XML (sécurité + validité du flux). */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_request: Request, { params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) {
    return new Response("Unknown locale", { status: 404 });
  }
  const lang = params.lang;
  const locale = LANGUAGES.find((language) => language.code === lang)?.locale ?? lang;

  // Pages statiques + guides : toujours déclarés, même base indisponible.
  let entries: Entry[] = [...STATIC_PATHS, ...GUIDE_ENTRIES];

  try {
    const [articles, reports, webinars] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
        take: 5000,
      }),
      prisma.report.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        take: 5000,
      }),
      prisma.webinar.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, updatedAt: true },
        take: 5000,
      }),
    ]);

    const fromDatabase: Entry[] = [
      ...articles.map((article) => ({
        path: `${isGuideArticle(article.category?.slug) ? "/guides/" : "/analyses/"}${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...reports.map((report) => ({
        path: `/rapports/${report.slug}`,
        lastModified: report.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...webinars.map((webinar) => ({
        path: `/webinaires/${webinar.slug}`,
        lastModified: webinar.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];

    /**
     * Dédoublonnage par chemin : un guide importé en base
     * (`npm run db:import-guides`) figure aussi dans `GUIDE_ENTRIES` — la
     * version base l'emporte, elle porte le vrai `updatedAt`.
     */
    entries = [
      ...new Map(
        [...STATIC_PATHS, ...GUIDE_ENTRIES, ...fromDatabase].map((entry) => [entry.path, entry])
      ).values(),
    ];
  } catch {
    // Base indisponible : on renvoie au moins les pages statiques + les guides.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map((entry) => {
    const alternates = Object.entries(languageAlternates(entry.path))
      .map(
        ([hreflang, path]) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(
            `${SITE_URL}${path}`
          )}"/>`
      )
      .join("\n");

    return `  <url>
    <loc>${escapeXml(`${SITE_URL}${withLocale(entry.path, lang)}`)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
${alternates}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  return new Response(`<!-- locale: ${locale} -->\n${xml}`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
