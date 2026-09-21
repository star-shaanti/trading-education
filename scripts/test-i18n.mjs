/**
 * Test E2E multilingue (URLs préfixées par la langue) :
 * vérifie que `/{langue}/...` sert la bonne langue (`<html lang/dir>` + textes),
 * que les `hreflang` sont complets, que les URLs historiques sans préfixe
 * redirigent en 308 vers la version localisée, et que toutes les pages
 * publiques répondent 200 dans les 8 langues.
 *
 * Usage : node scripts/test-i18n.mjs [baseUrl]
 */

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Pages de contenu vérifiées avec leur marqueur traduit. */
const PAGES = ["/", "/analyses", "/rapports", "/webinaires"];

/** Toutes les pages publiques localisées (test de fumée : statut 200). */
const SMOKE_PAGES = [
  "/",
  "/analyses",
  "/rapports",
  "/webinaires",
  "/guides",
  "/guides/rsi",
  "/outils",
  "/outils/calculatrice-taille-position",
  "/ressources",
  "/recap",
  "/a-propos",
  "/mentions-legales",
  "/politiques",
  "/confidentialite",
];

const CASES = [
  {
    lang: "fr",
    dir: "ltr",
    markers: {
      "/": "Tout ce dont vous avez besoin",
      "/analyses": "Analyses de marché",
      "/rapports": "Rapports hebdomadaires",
      "/webinaires": "Webinaires",
    },
  },
  {
    lang: "en",
    dir: "ltr",
    markers: {
      "/": "Everything you need",
      "/analyses": "Market analysis",
      "/rapports": "Weekly reports",
      "/webinaires": "Webinars",
    },
  },
  {
    lang: "es",
    dir: "ltr",
    markers: {
      "/": "Todo lo que necesitas",
      "/analyses": "Análisis de mercado",
      "/rapports": "Informes semanales",
      "/webinaires": "Webinars",
    },
  },
  {
    lang: "de",
    dir: "ltr",
    markers: {
      "/": "Alles an einem Ort",
      "/analyses": "Marktanalysen",
      "/rapports": "Wöchentliche Berichte",
      "/webinaires": "Webinare",
    },
  },
  {
    lang: "it",
    dir: "ltr",
    markers: {
      "/": "Tutto ci",
      "/analyses": "Analisi di mercato",
      "/rapports": "Report settimanali",
      "/webinaires": "Webinar",
    },
  },
  {
    lang: "hi",
    dir: "ltr",
    markers: {
      "/": "एक ही जगह",
      "/analyses": "बाज़ार विश्लेषण",
      "/rapports": "साप्ताहिक रिपोर्ट",
      "/webinaires": "वेबिनार",
    },
  },
  {
    lang: "ar",
    dir: "rtl",
    markers: {
      "/": "في مكان واحد",
      "/analyses": "تحليلات السوق",
      "/rapports": "التقارير الأسبوعية",
      "/webinaires": "الندوات",
    },
  },
  {
    lang: "ru",
    dir: "ltr",
    markers: {
      "/": "Всё необходимое",
      "/analyses": "Аналитика рынка",
      "/rapports": "Недельные отчёты",
      "/webinaires": "Вебинары",
    },
  },
];

let failures = 0;

function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function get(path, lang, options = {}) {
  try {
    const response = await fetch(`${BASE}${path}`, {
      redirect: options.redirect ?? "follow",
      headers: lang ? { Cookie: `te_lang=${lang}` } : {},
    });
    return {
      status: response.status,
      location: response.headers.get("location") ?? "",
      body: response.status >= 300 && response.status < 400 ? "" : await response.text(),
    };
  } catch (error) {
    return { status: 0, location: "", body: `fetch error: ${error.message}` };
  }
}


/* 1. Chaque langue : langue HTML, sens de lecture, textes, hreflang, canonique. */
const EXPECTED_HREFLANG = [
  "fr-FR",
  "en-GB",
  "es-ES",
  "de-DE",
  "it-IT",
  "hi-IN",
  "ar-EG",
  "ru-RU",
  "x-default",
];

for (const testCase of CASES) {
  const results = [];
  let ok = true;

  for (const path of PAGES) {
    const url = `/${testCase.lang}${path === "/" ? "" : path}`;
    const page = await get(url);
    const langAttr = page.body.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
    const dirAttr = page.body.match(/<html[^>]*\sdir="([^"]+)"/)?.[1];
    const translated = page.body.includes(testCase.markers[path]);
    const canonical = page.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
    const hreflangs = [...page.body.matchAll(/hrefLang="([^"]+)"/g)].map((match) => match[1]);

    const alternatesOk =
      path === "/" ? true : EXPECTED_HREFLANG.every((locale) => hreflangs.includes(locale));
    const canonicalOk = canonical.endsWith(url);

    if (
      page.status !== 200 ||
      langAttr !== testCase.lang ||
      dirAttr !== testCase.dir ||
      !translated ||
      !alternatesOk ||
      !canonicalOk
    ) {
      ok = false;
    }

    results.push(
      `${url} ${page.status}${translated ? "" : " KO-texte"}${alternatesOk ? "" : " KO-hreflang"}${
        canonicalOk ? "" : " KO-canonical"
      }`
    );
  }

  check(`${testCase.lang} (${testCase.dir})`, ok, results.join(" | "));
}

/* 2. URLs historiques sans préfixe → 308 vers la version localisée. */
const legacyFr = await get("/analyses", undefined, { redirect: "manual" });
check(
  "legacy /analyses → 308 /fr/analyses",
  legacyFr.status === 308 && legacyFr.location.includes("/fr/analyses"),
  `${legacyFr.status} → ${legacyFr.location}`
);

const legacyDe = await get("/analyses", "de", { redirect: "manual" });
check(
  "legacy /analyses (cookie de) → 308 /de/analyses",
  legacyDe.status === 308 && legacyDe.location.includes("/de/analyses"),
  `${legacyDe.status} → ${legacyDe.location}`
);

const root = await get("/", undefined, { redirect: "manual" });
check(
  "racine / → 308 /fr",
  root.status === 308 && /\/fr$/.test(root.location),
  `${root.status} → ${root.location}`
);

/* 3. Locale inconnue → 404. */
const unknown = await get("/xx/analyses");
check("/xx/analyses → 404", unknown.status === 404, String(unknown.status));

/* 4. Test de fumée : toutes les pages publiques dans les 8 langues. */
console.log("\nFumée (pages publiques × 8 langues) :");
for (const testCase of CASES) {
  const broken = [];
  for (const path of SMOKE_PAGES) {
    const url = `/${testCase.lang}${path === "/" ? "" : path}`;
    const response = await get(url);
    if (response.status !== 200) broken.push(`${url} → ${response.status}`);
  }
  check(`${testCase.lang} | ${SMOKE_PAGES.length} pages`, broken.length === 0, broken.join(", "));
}

/* 5. Pages globales (non préfixées) toujours accessibles. */
for (const path of ["/connexion", "/inscription", "/feed.xml", "/robots.txt", "/sitemap.xml"]) {
  const page = await get(path);
  check(`global ${path} → 200`, page.status === 200, String(page.status));
}

console.log(failures === 0 ? "\nTests i18n : tous OK" : `\nTests i18n : ${failures} échec(s)`);
process.exitCode = failures === 0 ? 0 : 1;
