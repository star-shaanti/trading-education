/**
 * Diagnostic du SITE DÉPLOYÉ, depuis votre terminal.
 *
 * Usage :
 *   npm run diagnose:prod
 *   npm run diagnose:prod -- https://tradingeducationpro.com
 *
 * Vérifie, sans rien modifier : application vivante, configuration NextAuth,
 * rendu des pages (500 « Application error » ?), accès à la base via les
 * contenus publiés (feed/sitemap), route et page d'inscription.
 */
const BASE = (process.argv[2] ?? process.env.SITE_URL ?? "https://tradingeducationpro.com").replace(/\/$/, "");

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function get(path) {
  try {
    const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    return { status: 0, body: error instanceof Error ? error.message : String(error) };
  }
}

console.log(`Cible : ${BASE}\n`);

/* 1. L'application répond-elle ? (route sans session ni base) */
const robots = await get("/robots.txt");
check("application vivante (/robots.txt)", robots.status === 200, `HTTP ${robots.status}`);

/* 2. Configuration NextAuth : 500 ici = NEXTAUTH_SECRET/URL manquant */
const csrf = await get("/api/auth/csrf");
check(
  "NextAuth configuré (/api/auth/csrf)",
  csrf.status === 200,
  csrf.status === 500
    ? "HTTP 500 « There is a problem with the server configuration » → NEXTAUTH_SECRET / NEXTAUTH_URL à définir dans Coolify"
    : `HTTP ${csrf.status}`
);

const session = await get("/api/auth/session");
check("API session (/api/auth/session)", session.status === 200, `HTTP ${session.status}`);

/* 3. Rendu des pages */
const home = await get("/fr");
const digest =
  home.body.match(/"(?:digest|errorDigest)":"?(\d+)/)?.[1] ?? home.body.match(/Digest:\s*(\d+)/)?.[1];
check(
  "page d'accueil rendue (/fr)",
  home.status === 200 && !home.body.includes("Application error"),
  `HTTP ${home.status}${digest ? ` · digest ${digest}` : ""}${
    home.status === 500 ? " → cause exacte dans Coolify → Logs (Application)" : ""
  }`
);

const connexion = await get("/connexion");
check("page de connexion servie (/connexion)", connexion.status === 200, `HTTP ${connexion.status}`);

/* 4. Base de données, mesurée par le contenu réellement publié */
const feed = await get("/feed.xml");
const items = (feed.body.match(/<item>/g) ?? []).length;
const sitemap = await get("/sitemaps/fr/sitemap.xml");
const urls = (sitemap.body.match(/<loc>/g) ?? []).length;
check(
  "base joignable et contenus publiés (feed + sitemap)",
  feed.status === 200 && sitemap.status === 200 && (items > 0 || urls > 12),
  `feed=${items} item(s) · sitemap=${urls} URL(s)` +
    (items === 0 || urls <= 12
      ? " → base vide ou injoignable : npx prisma migrate deploy && npm run db:seed"
      : "")
);

/* 5. Inscription (payload invalide : aucune écriture en base) */
const register = await fetch(`${BASE}/api/inscription`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
const registerBody = await register.text();
check(
  "route d'inscription vivante (/api/inscription)",
  register.status === 400,
  register.status === 500
    ? "HTTP 500 → base de données absente ou injoignable (voir Logs Coolify)"
    : `HTTP ${register.status} ${registerBody.slice(0, 90)}`
);

const inscription = await get("/inscription");
check("page d'inscription servie (/inscription)", inscription.status === 200, `HTTP ${inscription.status}`);

console.log(
  failures === 0
    ? "\nSite déployé : tout fonctionne ✅"
    : `\nSite déployé : ${failures} point(s) à corriger ❌ (détails ci-dessus)`
);
process.exitCode = failures === 0 ? 0 : 1;
