import { SITE_URL } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/i18n/languages";

export const dynamic = "force-dynamic";

/**
 * Index des sitemaps : un sitemap par langue (`/sitemaps/{langue}/sitemap.xml`).
 * Google découvre ainsi les 8 versions linguistiques et leurs `hreflang`.
 */
export async function GET() {
  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${LANGUAGES.map(
  (language) => `  <sitemap>
    <loc>${SITE_URL}/sitemaps/${language.code}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
).join("\n")}
</sitemapindex>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
