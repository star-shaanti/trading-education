import { SITE_URL, normalizeLang, pick, withLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { isGuideArticle } from "@/lib/queries";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Flux RSS 2.0 : `/feed.xml` (FR par défaut, `/feed.xml?lang=en` pour les autres
 * langues). Permet l'indexation rapide, l'agrégation et l'abonnement lecteurs.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedItem = {
  title: string;
  url: string;
  date: Date;
  summary: string;
  category: string;
};

export async function GET(request: Request) {
  const lang = normalizeLang(new URL(request.url).searchParams.get("lang"));

  let items: FeedItem[] = [];

  try {
    const [articles, reports, webinars] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 30,
        select: {
          slug: true,
          title: true,
          titleFr: true,
          excerpt: true,
          excerptFr: true,
          publishedAt: true,
          updatedAt: true,
          category: { select: { slug: true, name: true, nameFr: true } },
        },
      }),
      prisma.report.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 10,
        select: { slug: true, title: true, titleFr: true, summary: true, summaryFr: true, publishedAt: true, updatedAt: true },
      }),
      prisma.webinar.findMany({
        where: { publishedAt: { not: null } },
        orderBy: { startsAt: "desc" },
        take: 10,
        select: { slug: true, title: true, titleFr: true, description: true, descriptionFr: true, startsAt: true, updatedAt: true },
      }),
    ]);

    items = [
      ...articles.map((article) => ({
        title: pick(lang, article.title, article.titleFr) ?? article.title,
        url: `${SITE_URL}${withLocale(
          `${isGuideArticle(article.category?.slug) ? "/guides/" : "/analyses/"}${article.slug}`,
          lang
        )}`,
        date: article.publishedAt ?? article.updatedAt,
        summary: pick(lang, article.excerpt, article.excerptFr) ?? "",
        category: pick(lang, article.category?.name, article.category?.nameFr) ?? "Analyse",
      })),
      ...reports.map((report) => ({
        title: pick(lang, report.title, report.titleFr) ?? report.title,
        url: `${SITE_URL}${withLocale(`/rapports/${report.slug}`, lang)}`,
        date: report.publishedAt ?? report.updatedAt,
        summary: pick(lang, report.summary, report.summaryFr) ?? "",
        category: "Rapport",
      })),
      ...webinars.map((webinar) => ({
        title: pick(lang, webinar.title, webinar.titleFr) ?? webinar.title,
        url: `${SITE_URL}${withLocale(`/webinaires/${webinar.slug}`, lang)}`,
        date: webinar.startsAt ?? webinar.updatedAt,
        summary: pick(lang, webinar.description, webinar.descriptionFr) ?? "",
        category: "Webinaire",
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch {
    // Base indisponible : on renvoie un flux vide mais valide.
    items = [];
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(
      "Analyses de marché, rapports PDF et webinaires gratuits — contenu éducatif sans paywall."
    )}</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.summary.slice(0, 400))}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
