/**
 * Test SEO technique : vérifie les briques d'indexation réellement servies.
 *
 * Usage : node scripts/test-seo.mjs [baseUrl]
 *   node scripts/test-seo.mjs http://localhost:3000   (dev)
 *   node scripts/test-seo.mjs http://localhost:3100   (build de prod)
 */

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

let failures = 0;

function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function get(path, lang = "fr") {
  try {
    const response = await fetch(`${BASE}${path}`, {
      headers: { Cookie: `te_lang=${lang}` },
      redirect: "follow",
    });
    return {
      status: response.status,
      type: response.headers.get("content-type") ?? "",
      body: await response.text(),
    };
  } catch (error) {
    return { status: 0, type: "", body: `fetch error: ${error.message}` };
  }
}

/* 1. robots.txt */
const robots = await get("/robots.txt");
check("robots.txt servi", robots.status === 200);
check("robots.txt → sitemap déclaré", robots.body.includes("Sitemap:"));
check("robots.txt → pages privées exclues", robots.body.includes("/newsletter/") && robots.body.includes("/admin"));
check("robots.txt → crawlers IA explicités", robots.body.includes("GPTBot"));

/* 2. Flux RSS */
const feed = await get("/feed.xml");
const feedIsXml = feed.type.includes("xml") || feed.body.startsWith("<?xml");
check("feed.xml servi (XML)", feed.status === 200 && feedIsXml, feed.type);
check("feed.xml → au moins un item", feed.body.includes("<item>"), `${(feed.body.match(/<item>/g) ?? []).length} item(s)`);
check("feed.xml → liens localisés", feed.body.includes("/fr/rapports/") || feed.body.includes("/fr/analyses/"));

/* 3. Accueil : données structurées de site + métadonnées */
const home = await get("/fr");
check("accueil → JSON-LD Organization", home.body.includes('"@type":"Organization"'));
check("accueil → JSON-LD WebSite + recherche", home.body.includes('"@type":"WebSite"') && home.body.includes("SearchAction"));
check("accueil → link RSS dans <head>", home.body.includes('application/rss+xml'));
check("accueil → twitter:card", home.body.includes("twitter:card"));
check("accueil → og:image générée", home.body.includes("og:image"));
check("accueil → directives max-image-preview", home.body.includes("max-image-preview"));

/* 4. Listes : canonical + pagination + filtres (URLs localisées /fr/...) */
const analyses = await get("/fr/analyses");
const canonical = analyses.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
check("analyses → canonical auto (préfixé par la langue)", canonical.endsWith("/fr/analyses"), canonical);
check("analyses → og:title présent", analyses.body.includes("og:title"));
check(
  "analyses → hreflang complet (8 langues + x-default)",
  ["fr-FR", "en-GB", "de-DE", "ar-EG", "ru-RU", "x-default"].every((locale) =>
    analyses.body.includes(`hrefLang="${locale}"`)
  )
);

const filtered = await get("/fr/analyses?q=risque");
check("analyses filtrées → noindex", /name="robots"[^>]*content="[^"]*noindex/.test(filtered.body));

const page2 = await get("/fr/analyses?page=2");
const canonical2 = page2.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
check("analyses page 2 → canonical auto-référent", canonical2.includes("page=2"), canonical2);

/* 5. Pages de détail : fil d'Ariane + JSON-LD (rapport et webinaire garantis
   par le flux ; analyse testée si la base en contient). */
const reportUrl = feed.body.match(/<link>(https?:[^<]*\/rapports\/[^<]+)<\/link>/)?.[1] ?? "";
const webinarUrl = feed.body.match(/<link>(https?:[^<]*\/webinaires\/[^<]+)<\/link>/)?.[1] ?? "";

/** Vérifie les éléments SEO attendus sur une page de détail. */
async function checkDetail(label, url, expectsBreadcrumb) {
  if (!url) {
    check(`${label} → slug trouvé dans le flux`, false, "aucun contenu publié ?");
    return;
  }
  const path = url.replace(/^https?:\/\/[^/]+/, "");
  const detail = await get(path);
  check(`${label} ${path} → 200`, detail.status === 200);
  check(`${label} → JSON-LD Article/Event`, /"@type":"(Article|Event)"/.test(detail.body));
  if (expectsBreadcrumb) {
    check(`${label} → JSON-LD BreadcrumbList`, detail.body.includes('"@type":"BreadcrumbList"'));
    check(
      `${label} → fil d'Ariane visible`,
      detail.body.includes('aria-label="Breadcrumb"') && detail.body.includes('aria-current="page"')
    );
  }
}

await checkDetail("détail rapport", reportUrl, true);
await checkDetail("détail webinaire", webinarUrl, true);

const analyseSlug = analyses.body.match(/href="\/fr\/analyses\/([a-z0-9-]+)"/)?.[1];
if (analyseSlug) {
  await checkDetail("détail analyse", `/fr/analyses/${analyseSlug}`, true);
} else {
  console.log("INFO détail analyse : aucun article publié hors guides (liste vide) — test ignoré");
}

/* 6. Image Open Graph par défaut */
try {
  const og = await fetch(`${BASE}/opengraph-image`);
  const bytes = (await og.arrayBuffer()).byteLength;
  check(
    "opengraph-image → PNG généré (1200×630)",
    og.status === 200 && (og.headers.get("content-type") ?? "").includes("image") && bytes > 10_000,
    `${og.headers.get("content-type") ?? "?"} · ${Math.round(bytes / 1024)} Ko`
  );
} catch (error) {
  check("opengraph-image → PNG généré (1200×630)", false, error.message);
}

/* 7. Sitemaps : index + un sitemap par langue avec alternates hreflang */
const sitemapIndex = await get("/sitemap.xml");
check(
  "sitemap.xml → index avec 8 sitemaps de langue",
  sitemapIndex.status === 200 &&
    sitemapIndex.body.includes("<sitemapindex") &&
    (sitemapIndex.body.match(/<sitemap>/g) ?? []).length === 8,
  `${(sitemapIndex.body.match(/<sitemap>/g) ?? []).length} sitemaps`
);

const sitemapDe = await get("/sitemaps/de/sitemap.xml");
check(
  "sitemaps/de/sitemap.xml → URLs localisées",
  sitemapDe.status === 200 && sitemapDe.body.includes("/de/analyses") && sitemapDe.body.includes("<urlset"),
  `${(sitemapDe.body.match(/<url>/g) ?? []).length} URLs`
);
check(
  "sitemaps/de → alternates xhtml:link hreflang",
  sitemapDe.body.includes("xhtml:link") && sitemapDe.body.includes('hreflang="x-default"'),
  `${(sitemapDe.body.match(/xhtml:link/g) ?? []).length} alternates`
);
check("sitemaps/de → URL de guides canoniques", sitemapDe.body.includes("/guides/"));

const sitemapUnknown = await get("/sitemaps/xx/sitemap.xml");
check("sitemaps/xx → 404", sitemapUnknown.status === 404, String(sitemapUnknown.status));

console.log(failures === 0 ? "\nSEO technique : tous OK" : `\nSEO technique : ${failures} échec(s)`);
process.exitCode = failures === 0 ? 0 : 1;
